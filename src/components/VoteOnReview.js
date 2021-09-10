import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import React from "react"
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa"
import { useReviewsContract } from "../hooks/useReviewsContract"
import { useCall } from "../web3hook/useCall"

const VoteOnReview = ({ id, review }) => {
  const [reviews] = useReviewsContract()

  const [status, contractCall] = useCall()

  async function VoteOnReview(vote) {
    await contractCall(reviews, "vote", [vote, id])
  }

  console.log(review.nbVotes)
  console.log(id)

  return (
    <Flex alignItems="center" my="5" justifyContent="start">
      <Text me="2">Review #{review.id}</Text>
      <Box textAlign="center" me="2">
        <IconButton
          colorScheme="green"
          borderRadius="10px"
          me="1"
          aria-label="thumb ub"
          icon={<FaThumbsUp />}
          onClick={() => VoteOnReview(1)}
          isLoading={
            status.startsWith("Waiting") || status.startsWith("Pending")
          }
          disabled={
            status.startsWith("Waiting") || status.startsWith("Pending")
          }
        />

        <IconButton
          aria-label="thumb down"
          icon={<FaThumbsDown />}
          isLoading={
            status.startsWith("Waiting") || status.startsWith("Pending")
          }
          disabled={
            status.startsWith("Waiting") || status.startsWith("Pending")
          }
          onClick={() => VoteOnReview("0")}
          colorScheme="red"
          borderRadius="10px"
        />
      </Box>

      <Text>Vote: {review.nbVotes}</Text>
    </Flex>
  )
}

export default VoteOnReview
