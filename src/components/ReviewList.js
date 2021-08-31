import { Heading, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import { useIPFS } from "../hooks/useIPFS"
import { useReviewsContract } from "../hooks/useReviewsContract"
import { useUsersContract } from "../hooks/useUsersContract"

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
  const [users] = useUsersContract()
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

            // get user info
            const authorID = await users.profileID(review.author)
            const nameCID = await users.userName(authorID)
            const { firstName, lastName } = await readIPFS(nameCID)

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
      {reviewList !== undefined
        ? reviewList.map((review) => {
            return (
              <>
                <Heading>{review.title}</Heading>
                <Text>
                  {review.firstName} {review.lastName}
                </Text>
                <Text>{review.content}</Text>
                <Text>{review.date}</Text>
                <Text>{review.txHash}</Text>
                <Text>{review.blockNumber}</Text>
                <Text>Number of comments: {review.comments.length}</Text>
              </>
            )
          })
        : ""}
    </>
  )
}

export default ReviewList
