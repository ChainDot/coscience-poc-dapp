import { Flex, Text, IconButton, Box } from "@chakra-ui/react"
import React from "react"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useCall } from "../web3hook/useCall"

const ArticleValidity = ({ id, article }) => {
  const { articles } = useArticlesContract()
  const [status, contractCall] = useCall()

  async function VoteValidity(validity) {
    await contractCall(articles, "voteValidity", [validity, id])
  }

  return (
    <Flex alignItems="center" my="2">
      <Text me="5">Validity</Text>
      <Box me="5">
        <IconButton
          aria-label="thumb ub"
          icon={<FaThumbsUp />}
          onClick={() => VoteValidity(1)}
          isLoading={
            status.startsWith("Waiting") || status.startsWith("Pending")
          }
          disabled={
            status.startsWith("Waiting") || status.startsWith("Pending")
          }
          me="1"
          borderRadius="full"
          colorScheme="green"
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
          onClick={() => VoteValidity(0)}
          borderRadius="full"
          colorScheme="red"
        />
      </Box>
      <Text>
        {(article.validity + article.validityVotes) / 2} /{" "}
        {article.validityVotes}
      </Text>
    </Flex>
  )
}

export default ArticleValidity

// Voter 1 = +1
// voter2 = -1
// total = 0
// score = 1/2
