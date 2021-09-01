import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  Skeleton,
  Text,
} from "@chakra-ui/react"

const ReviewHeader = ({ review }) => {
  return (
    <Box p="10" bg="gray.200">
      {review !== undefined ? (
        <>
          <Flex
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent={{ base: "start", lg: "space-between" }}
          >
            <Heading py="4" as="h1">
              Review n°{review.id}
            </Heading>
            <Text fontSize="4xl" py="4"></Text>
          </Flex>
          <Divider bg="orange" border="solid" borderColor="orange" />
          <Flex
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent={{ base: "start", lg: "space-between" }}
          >
            <Box mt="4" fontSize="xl">
              <Heading fontSize="xl">Review data</Heading>
              <Text>
                Published on:{" "}
                <Text as="span" fontWeight="bold">
                  {`${review.date}`} (UTC)
                </Text>
              </Text>
              <Text>
                Number of comments:{" "}
                <Text as="span" fontWeight="bold">
                  {review.comments.length}
                </Text>
              </Text>{" "}
            </Box>
            <Box mt="4" fontSize="lg" textAlign={{ base: "start", lg: "end" }}>
              <Heading fontSize="xl">Blockchain informations</Heading>

              <Text>
                Address of author:{" "}
                <Link
                  color="blue"
                  isExternal
                  href={`https://rinkeby.etherscan.io/tx/${review.author}`}
                >
                  {review.author.slice(0, 20)}...
                </Link>{" "}
                (Etherscan)
              </Text>
              <Text>
                Mined in block n°
                <Link
                  color="blue"
                  isExternal
                  href={`https://rinkeby.etherscan.io/txs?block=${review.blockNumber}`}
                >
                  {review.blockNumber}
                </Link>{" "}
                (Etherscan)
              </Text>

              <Text>
                Transaction hash:{" "}
                <Link
                  color="blue"
                  isExternal
                  href={`https://rinkeby.etherscan.io/tx/${review.txHash}`}
                >
                  {review.txHash.slice(0, 15)}...
                </Link>{" "}
                (Etherscan)
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
export default ReviewHeader
