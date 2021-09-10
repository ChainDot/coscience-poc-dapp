import { Flex, Text, IconButton, Box } from "@chakra-ui/react"
import React from "react"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useCall } from "../web3hook/useCall"

const ArticleImportance = ({ id, article }) => {
  const { articles } = useArticlesContract()
  const [status, contractCall] = useCall()

  console.log(article.validityVotes)
  console.log(article.importanceVotes)

  async function VoteImportance(importance) {
    await contractCall(articles, "voteImportance", [importance, id])
  }

  return (
    <Flex alignItems="center" my="5" justifyContent="space-between">
      <Text>Importance</Text>
      <Box>
        {" "}
        <IconButton
          aria-label="thumb ub"
          icon={<FaThumbsUp />}
          onClick={() => VoteImportance(1)}
          isLoading={
            status.startsWith("Waiting") || status.startsWith("Pending")
          }
          disabled={
            status.startsWith("Waiting") || status.startsWith("Pending")
          }
          colorScheme="green"
          borderRadius="10px"
          me="1"
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
          onClick={() => VoteImportance(0)}
          colorScheme="red"
          borderRadius="10px"
        />
      </Box>

      <Text>
        Vote: {article.importanceVotes - article.importance} /{" "}
        {article.importanceVotes}
      </Text>
    </Flex>
  )
}

export default ArticleImportance

// Voter 1 = +1
// voter2 = -1
// total = 0
// score = 1/2
