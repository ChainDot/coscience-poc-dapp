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
  const [reviews, , createReviewsList, eventList] = useReviewsContract()
  const { users } = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [reviewList, setReviewList] = useState()

  // get review data
  useEffect(() => {
    if (reviews && article !== undefined && eventList) {
      const reviewData = async () => {
        const listOfId = await articleReviewIds(reviews, article)
        const reviewList = await createReviewsList(reviews, listOfId)

        const asyncRes = await Promise.all(
          reviewList.map(async (review) => {
            // get the content from IFPS
            const { title, content } = await readIPFS(review.contentCID)

            //get review vote
            const structReview = await reviews.reviewInfo(review.id)
            const { vote } = structReview

            //get number of vote
            let nbReviewVote = await reviews.filters.Voted(
              null,
              Number(review.id.toString(16)),
              null
            )

            const eventArray = await reviews.queryFilter(nbReviewVote)
            const nbVotes = eventArray.length

            // get user info
            const authorID = await users.profileID(review.author)
            const struct = await users.userInfo(authorID)

            const { firstName, lastName } = await readIPFS(struct.nameCID)

            // get event info
            const { txHash, timestamp, blockNumber, date } =
              eventList[review.id]

            return {
              ...review,
              title,
              authorID,
              content,
              firstName,
              lastName,
              txHash,
              timestamp,
              blockNumber,
              date,
              vote,
              nbVotes,
            }
          })
        )

        setReviewList(asyncRes)
      }
      reviewData()
    }
  }, [reviews, article, readIPFS, createReviewsList, users, eventList])

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
