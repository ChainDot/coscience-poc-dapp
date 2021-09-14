import { Flex, Text, IconButton } from "@chakra-ui/react"
import React from "react"
import { FaHeart } from "react-icons/fa"

import { useCommentsContract } from "../hooks/useCommentsContract"
import { useCall } from "../web3hook/useCall"

const VoteOnComment = ({ comment }) => {
  const { comments } = useCommentsContract()
  const [status, contractCall] = useCall()

  async function VoteOn() {
    await contractCall(comments, "vote", [comment.id])
  }

  return (
    <Flex my="5" alignItems="center">
      <IconButton
        colorScheme="red"
        aria-label="like"
        icon={<FaHeart />}
        onClick={() => VoteOn()}
        isLoading={status.startsWith("Waiting") || status.startsWith("Pending")}
        disabled={status.startsWith("Waiting") || status.startsWith("Pending")}
        me="1"
        borderRadius="full"
        variant="ghost"
      />

      <Text>{comment.nbVotes}</Text>
    </Flex>
  )
}

export default VoteOnComment
