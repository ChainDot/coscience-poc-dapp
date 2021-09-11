import { Flex, Text, IconButton, Box } from '@chakra-ui/react'
import React from 'react'
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'

import { useReviewsContract } from '../hooks/useReviewsContract'
import { useCall } from '../web3hook/useCall'

const VoteOnReview = ({ id, review }) => {
  const { reviews } = useReviewsContract()
  const [status, contractCall] = useCall()

  async function VoteOn(choice) {
    await contractCall(reviews, 'vote', [choice, id])
  }
  return (
    <Flex my='5' alignItems='center'>
      {/* <Text>Review </Text> */}
      <Box>
        <IconButton
          aria-label='thumb ub'
          icon={<FaThumbsUp />}
          onClick={() => VoteOn(1)}
          isLoading={
            status.startsWith('Waiting') || status.startsWith('Pending')
          }
          disabled={
            status.startsWith('Waiting') || status.startsWith('Pending')
          }
          me='1'
          borderRadius='5'
        />

        <IconButton
          aria-label='thumb down'
          icon={<FaThumbsDown />}
          isLoading={
            status.startsWith('Waiting') || status.startsWith('Pending')
          }
          disabled={
            status.startsWith('Waiting') || status.startsWith('Pending')
          }
          onClick={() => VoteOn(0)}
          borderRadius='5'
          me='5'
        />
      </Box>
      <Text>
        {review.vote - review.vote} / {review.nbVotes}
      </Text>
    </Flex>
  )
}

export default VoteOnReview
