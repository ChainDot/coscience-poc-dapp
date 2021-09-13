import { createContext, useEffect, useState } from 'react'
import { useContract } from '../web3hook/useContract'
import { contractAddress, contractABI } from '../contracts/comments'
import { useWeb3 } from '../web3hook/useWeb3'

export const CommentsContext = createContext(null)

const CommentsContextProvider = ({ children }) => {
  const [{ contract, mode }] = useContract(contractAddress, contractABI)

  const { state } = useWeb3()
  const { networkName } = state

  const [commentEvents, setCommentEvents] = useState()

  useEffect(() => {
    if (contract && networkName === 'rinkeby') {
      ;(async () => {
        const eventArray = await contract.queryFilter('Posted')
        const eventListArray = [
          {
            txHash: undefined,
            timestamp: 0,
            blockNumber: 0,
            date: ''
          }
        ]
        for (const event of eventArray) {
          const block = await event.getBlock()
          const date = new Date(block.timestamp * 1000)
          const obj = {
            // defined in the smart contract
            txHash: event.transactionHash,
            timestamp: block.timestamp,
            blockNumber: event.blockNumber,
            date: date.toLocaleString()
          }
          eventListArray.push(obj)
        }
        setCommentEvents(eventListArray)
        // [{null},{event1 = reviewID n°1}]
      })()
    }
  }, [contract, networkName])

  return (
    <CommentsContext.Provider value={[contract, mode, commentEvents]}>
      {children}
    </CommentsContext.Provider>
  )
}

export default CommentsContextProvider
