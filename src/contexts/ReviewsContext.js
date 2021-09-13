import { createContext, useEffect, useState } from 'react'
import { useContract } from '../web3hook/useContract'
import { contractAddress, contractABI } from '../contracts/reviews'
import { useWeb3 } from '../web3hook/useWeb3'

export const ReviewsContext = createContext(null)

const ReviewsContextProvider = ({ children }) => {
  const [{ contract, mode }] = useContract(contractAddress, contractABI)
  const { state } = useWeb3()
  const { networkName } = state

  const [reviewEvents, setReviewEvents] = useState()

  useEffect(() => {
    if (contract && networkName === 'rinkeby') {
      ;(async () => {
        const eventArray = await contract.queryFilter('Posted')
        const eventListArray = [
          {
            author: '',
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
            authorId: event.args.poster, // defined in the smart contract
            txHash: event.transactionHash,
            timestamp: block.timestamp,
            blockNumber: event.blockNumber,
            date: date.toLocaleString()
          }
          eventListArray.push(obj)
        }
        setReviewEvents(eventListArray)
        // [{null},{event1 = reviewID n°1}]
      })()
    }
  }, [contract, networkName])

  return (
    <ReviewsContext.Provider value={[contract, mode, reviewEvents]}>
      {children}
    </ReviewsContext.Provider>
  )
}

export default ReviewsContextProvider
