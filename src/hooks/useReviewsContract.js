import { useContext, useEffect, useState } from "react"
import { ReviewsContext } from "../contexts/ReviewsContext"
import { useWeb3 } from "../web3hook/useWeb3"

const getReviewData = async (reviews, id) => {
  const r = await reviews.reviewInfo(id)

  const reviewObj = {
    id: r.id.toNumber(),
    author: r.author,
    contentCID: r.contentCID,
    contentBanned: r.contentBanned,
    targetID: r.targetID.toNumber(),
    comments: r.comments,
    vote: r.vote.toNumber(),
  }
  return reviewObj
}

const createReviewList = async (reviews, listOfId) => {
  const reviewList = []

  for (const i of listOfId) {
    const reviewObj = await getReviewData(reviews, i)
    reviewList.push(reviewObj)
  }

  return reviewList
}

export const useReviewsContract = () => {
  const [reviews, mode] = useContext(ReviewsContext)
  const [eventList, setEventList] = useState()

  const { state } = useWeb3()
  const { networkName } = state

  useEffect(() => {
    if (reviews && networkName === "rinkeby") {
      ;(async () => {
        const eventArray = await reviews.queryFilter("Posted")
        const eventListArray = [
          {
            author: "",
            txHash: undefined,
            timestamp: 0,
            blockNumber: 0,
            date: "",
          },
        ]
        for (const event of eventArray) {
          const block = await event.getBlock()
          const date = new Date(block.timestamp * 1000)
          const obj = {
            authorId: event.args.poster, // defined in the smart contract
            txHash: event.transactionHash,
            timestamp: block.timestamp,
            blockNumber: event.blockNumber,
            date: date.toLocaleString(),
          }
          eventListArray.push(obj)
        }
        setEventList(eventListArray)
        // [{null},{event1 = reviewID n°1}]
      })()
    }
  }, [reviews, networkName])

  /*
  useEffect(() => {
    if (reviews) {
      const createReviewList = async () => {
        const nb = await reviews.nbOfReviews()
        const reviewsList = []
        for (let i = 1; i <= nb; i++) {
          const obj = await getReviewsData(reviews, i)
          reviewsList.push(obj)
        }
        setReviewList(reviewsList)
      }
      createReviewList()
    }
  }, [reviews])
  */

  // control call of the hook
  if (reviews === undefined) {
    throw new Error(
      `It seems that you are trying to use ReviewsContext outside of its provider`
    )
  }
  return [reviews, getReviewData, createReviewList, eventList]
}
