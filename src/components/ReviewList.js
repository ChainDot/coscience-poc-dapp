import { useState } from "react"
import { useEffect } from "react"
import { useIPFS } from "../hooks/useIPFS"
import { useReviewsContract } from "../hooks/useReviewsContract"
import { useUsersContract } from "../hooks/useUsersContract"
import { Box } from "@chakra-ui/react"
import Review from "./Review"
import Loading from "./Loading"

const articleReviewIds = async (reviews, article) => {
  if (reviews) {
    const nb = article.reviews.length
    const listOfId = []

    for (let i = 0; i < nb; i++) {
      const id = await article.reviews[i]
      listOfId.push(id.toNumber())
    }
    return listOfId
  }
}

const ReviewList = ({ article }) => {
  const { reviews, createReviewList } = useReviewsContract()
  const { users } = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [reviewList, setReviewList] = useState()

  // get review data
  useEffect(() => {
    const reviewData = async () => {
      const listOfId = await articleReviewIds(reviews, article)
      const reviewList = await createReviewList(reviews, listOfId)
      let nbReviewVote
      const asyncRes = await Promise.all(
        reviewList.map(async (review) => {
          // get the content from IFPS
          const { title, content } = await readIPFS(review.contentCID)

          //get review vote
          const structReview = await reviews.reviewInfo(review.id)
          const { vote } = structReview

          // event listener nb of vote
          nbReviewVote = await reviews.filters.Voted(
            null,
            Number(review.id),
            null
          )

          const eventArray = await reviews.queryFilter(nbReviewVote)
          const nbVotes = eventArray.length

          // get user info
          const authorID = await users.profileID(review.author)
          const struct = await users.userInfo(authorID)
          const { firstName, lastName } = await readIPFS(struct.nameCID)

          // event information
          let reviewEvent = await reviews.filters.Posted(null, review.id, null)
          reviewEvent = await reviews.queryFilter(reviewEvent)
          const block = await reviewEvent[0].getBlock()
          const date = new Date(block.timestamp * 1000)

          return {
            ...review,
            title,
            authorID,
            content,
            firstName,
            lastName,
            txHash: reviewEvent[0].transactionHash,
            timestamp: block.timestamp,
            blockNumber: reviewEvent[0].blockNumber,
            date: date.toLocaleString(),
            vote,
            nbVotes
          }
        })
      )

      setReviewList(asyncRes)
    }
    if (reviews && article !== undefined) {
      reviewData()
      reviews.on("Voted", reviewData)
      reviews.on("Posted", reviewData)
    }
    return () => {
      setReviewList()
      reviews?.off("Voted", reviewData)
      reviews?.off("Posted", reviewData)
    }
  }, [reviews, article, readIPFS, createReviewList, users])

  return (
    <>
      {reviewList !== undefined ? (
        reviewList.map((review) => {
          return (
            <Box key={review.id}>
              <Review review={review} />
            </Box>
          )
        })
      ) : (
        <Loading />
      )}
    </>
  )
}

export default ReviewList
