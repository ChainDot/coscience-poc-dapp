import { IconButton } from "@chakra-ui/button"
import { Flex, Text, Box } from "@chakra-ui/layout"
import React from "react"
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useCall } from "../web3hook/useCall"

const ArticleImportance = ({ id, article }) => {
  const { articles } = useArticlesContract()
  const [status, contractCall] = useCall()

  async function VoteImportance(Importance) {
    await contractCall(articles, "voteImportance", [Importance, id])
  }

  return (
    <Flex alignItems="center" my="2">
      <Text me="5">Importance</Text>
      <Box me="5">
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
          onClick={() => VoteImportance(0)}
          borderRadius="full"
          colorScheme="red"
        />
      </Box>
      <Text>
        {(article.importance + article.importanceVotes) / 2} /{" "}
        {article.importanceVotes}
      </Text>
    </Flex>
  )
}

export default ArticleImportance
