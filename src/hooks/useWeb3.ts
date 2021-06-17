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

export const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3>()
  const [contract, setContract] = useState<Contract>()
  const [account, setAccount] = useState('')

  const fetchWeb3 = useCallback(() => {
    console.log(1, window?.web3)
    let web3

    // Modern dapp browser
    if (window?.ethereum) {
      web3 = new Web3(window.ethereum)
      window.ethereum.enable().catch(console.error)
    } else if (window?.web3) {
      web3 = new Web3(window.web3.currentProvider)
    } else {
      const httpEndpoint = 'http://127.0.0.1:7545'
      web3 = new Web3(new Web3.providers.HttpProvider(httpEndpoint))
    }

    setWeb3(web3)
  }, [])

  const fetchContract = useCallback(async () => {
    if (!web3) return
    console.log(2, window?.web3)

    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]

    const networkId = await web3.eth.net.getId()
    const contract = new web3.eth.Contract((artifacts as any).abi, (artifacts as any).networks[networkId].address)

    setAccount(account)
    setContract(contract)
  }, [web3])

  useEffect(() => {
    fetchWeb3()
  }, [fetchWeb3])

  useEffect(() => {
    fetchContract()
  }, [fetchContract])

  return {
    web3,
    account,
    contract,
  }
}
