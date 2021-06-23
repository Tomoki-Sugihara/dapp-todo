import Common from 'ethereumjs-common'
import { sha256 } from 'js-sha256'
import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { accountState, contractState, web3State } from 'src/state/web3'

import artifacts from '../../build/contracts/TodoList.json'

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

export const useWeb3 = () => {
  const [web3] = useRecoilState(web3State)
  const [contract, setContract] = useRecoilState(contractState)
  const [{ address, privateKey }, setAccount] = useRecoilState(accountState)

  const fetchContract = useCallback(async () => {
    if (!address) return
    const networkId = await web3.eth.net.getId()
    const contract = new web3.eth.Contract((artifacts as any).abi, (artifacts as any).networks[networkId].address)
    setContract(contract)
  }, [web3, address, setContract])

  const createAccount = useCallback(
    (uid: string) => {
      const key = '0x' + sha256.hex(uid)
      const account = web3.eth.accounts.privateKeyToAccount(key)
      setAccount({ address: account.address, privateKey: key })
    },
    [web3.eth.accounts, setAccount],
  )

  const toContract = async (functionAbi: any) => {
    if (!web3 || !contract) return
    const EthereumTx = require('ethereumjs-tx').Transaction
    const netId = await web3.eth.net.getId()
    const details = {
      nonce: 0,
      gasPrice: 0,
      gasLimit: 8000000,
      from: address,
      to: contract.options.address,
      data: functionAbi,
    }
    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'privatechain',
        networkId: netId,
        chainId: netId,
      },
      'petersburg',
    )

    return new Promise<void>((resolve, reject) => {
      web3.eth.getTransactionCount(address, async (err, nonce) => {
        details.nonce = nonce
        const transaction = await new EthereumTx(details, { common: customCommon })
        transaction.sign(Buffer.from(privateKey.slice(2), 'hex'))
        const rawdata = '0x' + transaction.serialize().toString('hex')
        await web3.eth
          .sendSignedTransaction(rawdata)
          .on('transactionHash', (hash) => {
            console.log(['transferToStaging Trx Hash:' + hash]) // eslint-disable-line no-console
          })
          .on('receipt', async (receipt) => {
            resolve(console.log(['transferToStaging Receipt:', receipt])) // eslint-disable-line no-console
          })
          .on('error', (error) => {
            reject(console.error(error))
          })
      })
    })
  }

  useEffect(() => {
    fetchContract()
  }, [fetchContract])

  return {
    web3,
    address,
    contract,
    privateKey,
    toContract,
    createAccount,
  }
}
