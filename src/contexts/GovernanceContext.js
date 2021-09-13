import { createContext } from 'react'
import { useContract } from '../web3hook/useContract'
import { contractAddress, contractABI } from '../contracts/governance'

export const GovernanceContext = createContext(null)

const GovernanceContextProvider = ({ children }) => {
  const [{ contract, mode }] = useContract(contractAddress, contractABI)

  return (
    <GovernanceContext.Provider value={[contract, mode]}>
      {children}
    </GovernanceContext.Provider>
  )
}

export default GovernanceContextProvider
