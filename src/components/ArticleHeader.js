import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  Skeleton,
  Text,
} from "@chakra-ui/react"

const ArticleHeader = ({ id, article, eventList }) => {
  return (
    <Box p="10" bg="gray.200">
      {article && eventList ? (
        <>
          <Flex
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent={{ base: "start", lg: "space-between" }}
          >
            <Heading py="4" as="h1">
              Article informations
            </Heading>
            <Text fontSize="4xl" py="4">
              Article n°{article.id}
            </Text>
          </Flex>
          <Divider bg="orange" border="solid" borderColor="orange" />
          <Flex
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent={{ base: "start", lg: "space-between" }}
          >
            <Box mt="4" fontSize="xl">
              <Heading fontSize="xl">Article data</Heading>
              <Text>
                Published on:{" "}
                <Text as="span" fontWeight="bold">
                  {`${eventList[id].date}`} (UTC)
                </Text>
              </Text>

              <Text>
                Number of reviews:{" "}
                <Text as="span" fontWeight="bold">
                  {article.reviews.length}
                </Text>{" "}
              </Text>

              <Text>
                Number of comments:{" "}
                <Text as="span" fontWeight="bold">
                  {article.comments.length}
                </Text>
              </Text>
            </Box>
            <Box mt="4" fontSize="lg" textAlign={{ base: "start", lg: "end" }}>
              <Heading fontSize="xl">Blockchain informations</Heading>

              <Text>
                Address of author:{" "}
                <Link
                  color="blue"
                  isExternal
                  href={`https://rinkeby.etherscan.io/tx/${article.author}`}
                >
                  {article.author.slice(0, 20)}...
                </Link>{" "}
                (Etherscan)
              </Text>
              <Text>
                Mined in block n°
                <Link
                  color="blue"
                  isExternal
                  href={`https://rinkeby.etherscan.io/txs?block=${eventList[id].blockNumber}`}
                >
                  {eventList[id].blockNumber}
                </Link>{" "}
                (Etherscan)
              </Text>

              <Text>
                Transaction hash:{" "}
                <Link
                  color="blue"
                  isExternal
                  href={`https://rinkeby.etherscan.io/tx/${eventList[id].txHash}`}
                >
                  {eventList[id].txHash.slice(0, 15)}...
                </Link>{" "}
                (Etherscan)
              </Text>
              <Heading fontSize="xl">IPFS information</Heading>
              <Text>
                IPFS Header:{" "}
                <Link
                  color="blue"
                  isExternal
                  href={`https://ipfs.io/ipfs/${article.abstractCID}`}
                >
                  {article.abstractCID.slice(0, 15)}...
                </Link>{" "}
                (Gateway: ipfs.io)
              </Text>
              <Text>
                IPFS content:{" "}
                <Link
                  color="blue"
                  isExternal
                  href={`https://ipfs.io/ipfs/${article.contentCID}`}
                >
                  {article.contentCID.slice(0, 15)}...
                </Link>{" "}
                (Gateway: ipfs.io)
              </Text>
            </Box>
          </Flex>
        </>
      ) : (
        <Skeleton height="200px" />
      )}
    </Box>
  )
}
export default ArticleHeader
