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
  const { reviews, createReviewList, reviewEvents } = useReviewsContract()
  const { users } = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [reviewList, setReviewList] = useState()

  // get review data
  useEffect(() => {
    if (reviews && article !== undefined && reviewEvents !== undefined) {
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
            const { vote, id } = structReview

            // event listener nb of vote
            nbReviewVote = await reviews.filters.Voted(null, Number(id), null)
            reviews.on(nbReviewVote, reviewData)

            const eventArray = await reviews.queryFilter(nbReviewVote)
            const nbVotes = eventArray.length

            // get user info
            const authorID = await users.profileID(review.author)
            const struct = await users.userInfo(authorID)

            const { firstName, lastName } = await readIPFS(struct.nameCID)

            // get event info
            const { txHash, timestamp, blockNumber, date } =
              reviewEvents[review.id]

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
              nbVotes
            }
          })
        )

        setReviewList(asyncRes)

        return () => {
          reviews.off(nbReviewVote, reviewData)
        }
      }
      reviewData()
    }
  }, [reviews, article, readIPFS, createReviewList, users, reviewEvents])

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
