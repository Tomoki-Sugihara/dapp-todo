import { atom } from 'recoil'
import Web3 from 'web3'
import type { Contract } from 'web3-eth-contract'

export const web3State = atom<Web3>({
  key: 'web3State',
  default: new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_PRIVATE_CHAIN_URL as string)),
  dangerouslyAllowMutability: true,
})

export const contractState = atom<Contract | null>({
  key: 'contractState',
  default: null,
  dangerouslyAllowMutability: true,
})

// export const contractState = selector<Contract>({
//   // export const contractState = selector<Promise<Contract>>({
//   key: 'contractState',
//   get: async ({ get }) => {
//     const web3 = get(web3State)
//     const networkId = await web3.eth.net.getId()
//     const contract = new web3.eth.Contract((artifacts as any).abi, (artifacts as any).networks[networkId].address)
//     return contract
//   },
//   dangerouslyAllowMutability: true,
// })

export const accountState = atom<{ address: string; privateKey: string }>({
  key: 'accountState',
  default: { address: '', privateKey: '' },
  dangerouslyAllowMutability: true,
})
