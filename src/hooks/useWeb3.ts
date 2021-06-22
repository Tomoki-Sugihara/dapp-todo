import Common from 'ethereumjs-common'
import { sha256 } from 'js-sha256'
import { useCallback, useEffect, useState } from 'react'
import Web3 from 'web3'
import type { Contract } from 'web3-eth-contract'

// import artifacts from '../../build/contracts/Migrations.json'
import artifacts from '../../build/contracts/TodoList.json'

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

// const initialWeb3 = () => {
//   const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_PRIVATE_CHAIN_URL as string))
//   return web3
// }
export const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3>(
    new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_PRIVATE_CHAIN_URL as string)),
  )
  // const [web3, setWeb3] = useState<Web3>(initialWeb3)
  const [contract, setContract] = useState<Contract>()
  const [account, setAccount] = useState('')

  const [privateKey, setPrivateKey] = useState('')

  // const fetchWeb3 = useCallback(() => {
  //   // console.log(1, window?.web3)
  //   // let web3

  //   // // Modern dapp browser
  //   // if (window?.ethereum) {
  //   //   web3 = new Web3(window.ethereum)
  //   //   window.ethereum.enable().catch(console.error)
  //   // } else if (window?.web3) {
  //   //   web3 = new Web3(window.web3.currentProvider)
  //   // } else {
  //   //   const httpEndpoint = 'http://127.0.0.1:7545'
  //   //   web3 = new Web3(new Web3.providers.HttpProvider(httpEndpoint))
  //   // }

  //   const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_PRIVATE_CHAIN_URL as string))

  //   setWeb3(web3)
  // }, [])

  const fetchContract = useCallback(async () => {
    // if (!web3) return
    // console.log(2, window?.web3)

    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]

    const networkId = await web3.eth.net.getId()
    const contract = new web3.eth.Contract((artifacts as any).abi, (artifacts as any).networks[networkId].address)

    return { account, contract }
    // setAccount(account)
    // setContract(contract)
  }, [web3])

  const createAccount = useCallback(
    (uid: string) => {
      console.log('enter')
      const key = '0x' + sha256.hex(uid)
      const web3 = new Web3(Web3.givenProvider)
      const account = web3.eth.accounts.privateKeyToAccount(key)
      console.log(account)
      console.log(key)

      setPrivateKey(key)
      console.log(privateKey)
      setWeb3(web3)
      console.log(privateKey)
      setAccount(account.address)
    },
    [privateKey],
  )
  // const createAccount = (uid: string) => {
  //   console.log('enter')
  //   const key = '0x' + sha256.hex(uid)
  //   const web3 = new Web3(Web3.givenProvider)
  //   const account = web3.eth.accounts.privateKeyToAccount(key)
  //   console.log(account)
  //   console.log(key)

  //   setWeb3(web3)
  //   setPrivateKey(key)
  //   console.log(privateKey)
  //   setAccount(account.address)
  // }

  useEffect(() => {
    console.log('effect', privateKey)
  }, [privateKey])

  const toContract = async (functionAbi: any) => {
    if (!web3 || !contract) return
    const EthereumTx = require('ethereumjs-tx').Transaction
    // const EthereumTx = ethereumjsTx.Transaction
    const netId = await web3.eth.net.getId()
    const details = {
      nonce: 0,
      gasPrice: 0,
      gasLimit: 8000000,
      from: account,
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

    // await web3.eth.getTransaction(account, async (err, nonce) => {
    await web3.eth.getTransactionCount(account, async (err, nonce) => {
      console.log(nonce)
      details.nonce = nonce
      const transaction = await new EthereumTx(details, { common: customCommon })
      console.log(transaction)
      console.log(privateKey)
      transaction.sign(
        Buffer.from('0x009880821de06a8a762ec4603b2d461cd567d0eb6f3fa411a7c29b1193eca51e'.slice(2), 'hex'),
      )
      // transaction.sign(Buffer.from(privateKey.slice(2), 'hex'))
      const rawdata = '0x' + transaction.serialize().toString('hex')
      await web3.eth
        .sendSignedTransaction(rawdata)
        .on('transactionHash', (hash) => {
          console.log(['transferToStaging Trx Hash:' + hash])
        })
        .on('receipt', async (receipt) => {
          console.log(['transferToStaging Receipt:', receipt])
        })
        .on('error', (error) => {
          console.error(error)
        })
    })
  }

  // useEffect(() => {
  //   fetchWeb3()
  // }, [fetchWeb3])

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      const { account, contract } = await fetchContract()
      setAccount(account)
      setContract(contract)
    })()
  }, [fetchContract])

  // useEffect(() => {
  //   fetchContract()
  // }, [fetchContract])

  return {
    web3,
    account,
    contract,
    privateKey,
    toContract,
    createAccount,
  }
}
