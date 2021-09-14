import { useContext } from "react"
import { ReviewsContext } from "../contexts/ReviewsContext"

const getReviewData = async (reviews, id) => {
  const r = await reviews.reviewInfo(id)

  const reviewObj = {
    id: r.id.toNumber(),
    author: r.author,
    contentCID: r.contentCID,
    contentBanned: r.contentBanned,
    targetID: r.targetID.toNumber(),
    comments: r.comments,
    vote: r.vote.toNumber()
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
  const [reviews, , reviewEvents] = useContext(ReviewsContext)
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
  return { reviews, getReviewData, createReviewList, reviewEvents }
}
