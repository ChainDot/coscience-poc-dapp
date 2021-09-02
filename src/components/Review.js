import { InfoIcon } from "@chakra-ui/icons"
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Text,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const Review = ({ review }) => {
  return (
    <Box p="5" key={review.id}>
      {review !== undefined ? (
        <>
          <Flex
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent={{ base: "start", lg: "space-between" }}
          >
            <Box>
              <Heading as="h2">{review.title}</Heading>

              <Text>
                by{" "}
                <Link
                  as={RouterLink}
                  color="orange"
                  to={`/profile/${review.authorID}`}
                >
                  {review.firstName} {review.lastName}
                </Link>{" "}
                | {review.date} | {review.comments.length} comments
              </Text>
            </Box>

            <Box textAlign={{ base: "start", lg: "end" }}>
              <Heading as="h2" fontSize="xl">
                Review #{review.id}
              </Heading>
              <Flex alignItems="center">
                <Text>Blockchain Informations</Text>
                <Box>
                  <Popover placement="top-start">
                    <PopoverTrigger>
                      <IconButton
                        variant="Link"
                        color="orange"
                        icon={<InfoIcon />}
                      />
                    </PopoverTrigger>
                    <PopoverContent w="100%" textAlign="start" p="2">
                      <PopoverHeader fontWeight="semibold">
                        Blockchain Informations
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <Text>
                          Address of author: {review.author}{" "}
                          <Link
                            color="orange"
                            isExternal
                            href={`https://rinkeby.etherscan.io/address/${review.author}`}
                          >
                            (Etherscan)
                          </Link>{" "}
                        </Text>
                        <Text>
                          Mined in block n° {review.blockNumber}{" "}
                          <Link
                            color="orange"
                            isExternal
                            href={`https://rinkeby.etherscan.io/txs?block=${review.blockNumber}`}
                          >
                            (Etherscan)
                          </Link>{" "}
                        </Text>

                        <Text>
                          Transaction hash: {review.txHash}{" "}
                          <Link
                            color="orange"
                            isExternal
                            href={`https://rinkeby.etherscan.io/tx/${review.txHash}`}
                          >
                            (Etherscan)
                          </Link>
                        </Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              </Flex>
            </Box>
          </Flex>

          <Container maxW="container.lg" mt="5">
            <Text>{review.content}</Text>
          </Container>
        </>
      ) : (
        <Skeleton height="200px" />
      )}
    </Box>
  )
}
export default Review
