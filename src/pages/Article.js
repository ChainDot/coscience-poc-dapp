import {
  Box,
  Text,
  Heading,
  useColorModeValue,
  Container,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  useDisclosure,
  Link,
  Button,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from "@chakra-ui/react"
import { useState, useEffect, useRef } from "react"
import { useParams, Link as RouterLink } from "react-router-dom"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useIPFS } from "../hooks/useIPFS"

import { useUsersContract } from "../hooks/useUsersContract"
import Loading from "../components/Loading"

import ArticleHeader from "../components/ArticleHeader"
import ReviewList from "../components/ReviewList"
import CommentList from "../components/CommentList"
import SendReview from "../components/SendReview"
import SendComment from "../components/SendComment"
import { useCall } from "../web3hook/useCall"
import { useGovernanceContract } from "../hooks/useGovernanceContract"
import { useReviewsContract } from "../hooks/useReviewsContract"
import { useCommentsContract } from "../hooks/useCommentsContract"

const Article = () => {
  const { id } = useParams()
  const { articles, getArticleData, articleEvents } = useArticlesContract()
  const { reviews } = useReviewsContract()
  const { comments } = useCommentsContract()
  const { governance } = useGovernanceContract()
  const { users, owner, isOwner } = useUsersContract()
  const [status, contractCall] = useCall()

  const [, readIPFS] = useIPFS()

  const [article, setArticle] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  // get data of the displayed article
  useEffect(() => {
    if (articles) {
      const articleData = async () => {
        const articleObj = await getArticleData(articles, id)

        //get validity and Importance
        const validity = articleObj.validity
        const importance = articleObj.importance

        // get number of voter
        //event ValidityVoted(Vote indexed choice, uint256 indexed articleID, uint256 indexed userID);
        // Contract
        let nbOfImportanceVote = await articles.filters.ImportanceVoted(
          null,
          Number(id.toString(16)), // need to hexify the number 1 = 0x01
          null
        )
        let eventArray = await articles.queryFilter(nbOfImportanceVote)
        const importanceVotes = eventArray.length

        let nbOfValidityVote = await articles.filters.ValidityVoted(
          null,
          Number(id.toString(16)), // need to hexify the number
          null
        )
        eventArray = await articles.queryFilter(nbOfValidityVote)
        const validityVotes = eventArray.length

        // get content
        const { title, abstract } = await readIPFS(articleObj.abstractCID)
        const { content, pdfFile } = await readIPFS(articleObj.contentCID)
        // get user info
        const userID = await users.profileID(articleObj.author)
        const struct = await users.userInfo(userID)
        const { firstName, lastName } = await readIPFS(struct.nameCID)
        const { laboratory } = await readIPFS(struct.profileCID)

        // get co author info
        let coAuthors = []
        for (const coAuthor of articleObj.coAuthor) {
          const coAuthorId = await users.profileID(coAuthor)
          if (coAuthorId !== 0) {
            const struct = await users.userInfo(coAuthorId)
            const { firstName, lastName } = await readIPFS(struct.nameCID)
            const { laboratory } = await readIPFS(struct.profileCID)
            coAuthors.push({ id: coAuthorId, firstName, lastName, laboratory })
          } // else return that author is not registred ?
        }
        // 0x2738549D4a37A9cA43a31EEcb1943fa9285E11b5
        // 0xA8674F9cEE637DD4de558D6E9B88db47225AF4C9
        // 0x90f92C106612Edc66167ae8d94e4959cCC9f4958

        setArticle({
          ...articleObj,
          title,
          abstract,
          content,
          pdfFile,
          authorID: userID,
          firstName,
          lastName,
          laboratory,
          coAuthors, // coAuthor: [{coAuthorId, firstName, lastName, laboratory},{}]
          validity,
          importance,
          validityVotes,
          importanceVotes
        })

        // listen the event with the filter
        articles.on(nbOfValidityVote, articleData)
        articles.on(nbOfImportanceVote, articleData)
        reviews?.on("Posted", articleData)
        comments?.on("Posted", articleData)
        return () => {
          articles.off(nbOfValidityVote, articleData)
          articles.off(nbOfImportanceVote, articleData)
          reviews?.off("Posted", articleData)
          comments?.off("Posted", articleData)
        }
      }
      articleData()
      // CLEAN UP !!
    }
  }, [articles, getArticleData, id, readIPFS, users, reviews, comments])

  // ban
  async function banArticle(id) {
    await contractCall(articles, "banArticle", [id])
  }

  async function voteToBanArticle(id) {
    await contractCall(governance, "voteToBanArticle", [id])
  }

  //                  Color Value
  const bg = useColorModeValue("white", "grayOrange.900")
  const txt = useColorModeValue("main", "second")
  const scheme = useColorModeValue("colorMain", "colorSecond")

  // --------------------------------------------------------------RETURN
  return (
    <>
      <Box shadow="lg" bg={bg}>
        {article?.id !== 0 ? (
          <ArticleHeader id={id} article={article} eventList={articleEvents} />
        ) : (
          ""
        )}

        <Container py="10" maxW="container.xl">
          {article ? (
            article.id !== 0 ? (
              <>
                <Box key={article.id}>
                  <Heading
                    fontFamily="title"
                    fontSize="6xl"
                    textAlign="center"
                    p="5"
                  >
                    {article.title}
                  </Heading>

                  {/* Authors of the articles */}
                  <Text my="4" fontSize="lg">
                    <Link
                      fontWeight="bold"
                      as={RouterLink}
                      to={`/profile/${article.authorID}`}
                    >
                      {article.firstName} {article.lastName}
                    </Link>
                    <Text as="sup"> 1 </Text>,{" "}
                    {article.coAuthors.map((coAuthor, index) => {
                      return (
                        <Box as="span" key={coAuthor.id}>
                          <Link as={RouterLink} to={`/profile/${coAuthor.id}`}>
                            {coAuthor.firstName} {coAuthor.lastName}
                          </Link>
                          <Text as="sup"> {index + 2} </Text>,{" "}
                        </Box>
                      )
                    })}
                  </Text>

                  <Heading fontSize="lg" as="h3">
                    Authors' affiliations
                  </Heading>
                  <Text>1. {article.laboratory}</Text>
                  {article.coAuthors.map((coAuthor, index) => {
                    return (
                      <Text key={coAuthor.id}>
                        {index + 2}. {coAuthor.laboratory}
                      </Text>
                    )
                  })}
                  {article.pdfFile !== "No PDF joined" ? (
                    <Button
                      as={Link}
                      isExternal
                      href={`https://ipfs.io/ipfs/${article.pdfFile}`}
                      mt="4"
                      variant="link"
                      color={txt}
                    >
                      PDF Link
                    </Button>
                  ) : (
                    <Text color="gray" mt="4">
                      No PDF File
                    </Text>
                  )}

                  <Heading
                    fontSize="lg"
                    as="h3"
                    textTransform="uppercase"
                    textAlign="center"
                  >
                    Abstract
                  </Heading>
                  <Text textAlign="center" my="4">
                    {article.abstract}
                  </Text>

                  <Heading
                    fontSize="lg"
                    as="h3"
                    textTransform="uppercase"
                    textAlign="center"
                    mt="20"
                  >
                    Content
                  </Heading>
                  <Text my="4">{article.content}</Text>
                  <Heading
                    fontSize="lg"
                    as="h3"
                    textTransform="uppercase"
                    textAlign="center"
                    mt="20"
                    color="gray.300"
                  >
                    Bibliographie
                  </Heading>
                  <Text mb="10" textAlign="center">
                    Not implemented yet...
                  </Text>

                  <Flex mb="10">
                    <Button
                      onClick={onOpen}
                      colorScheme={scheme}
                      me="4"
                      variant="link"
                    >
                      Reviews (
                      {article !== undefined ? article.reviews.length : "..."})
                    </Button>
                    <Button
                      onClick={onOpen}
                      colorScheme={scheme}
                      variant="link"
                    >
                      Comments (
                      {article !== undefined ? article.comments.length : "..."})
                    </Button>
                  </Flex>

                  <Flex
                    flexDirection={{ base: "column", lg: "row" }}
                    justifyContent="space-between"
                    mb="10"
                  >
                    <SendReview id={id} />
                    <SendComment id={id} targetAddress={articles.address} />
                  </Flex>
                </Box>
              </>
            ) : (
              <Heading textAlign="center">
                Oups this article doesn't exist
              </Heading>
            )
          ) : (
            <Loading />
          )}
          <Box>
            {/*Owner Options */}
            {owner !== governance?.address ? (
              isOwner ? (
                <Button
                  onClick={() => banArticle(id)}
                  isLoading={
                    status.startsWith("Waiting") || status.startsWith("Pending")
                  }
                  loadingText={status}
                  disabled={
                    status.startsWith("Waiting") || status.startsWith("Pending")
                  }
                >
                  Ban
                </Button>
              ) : (
                ""
              )
            ) : (
              <Button
                onClick={() => voteToBanArticle(id)}
                isLoading={
                  status.startsWith("Waiting") || status.startsWith("Pending")
                }
                loadingText={status}
                disabled={
                  status.startsWith("Waiting") || status.startsWith("Pending")
                }
              >
                Vote for ban
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* DRAWER */}
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        placement="bottom"
      >
        <DrawerOverlay />
        <DrawerContent maxH="60vh">
          <DrawerCloseButton />
          <DrawerHeader shadow="sm">Reviews & Comments</DrawerHeader>

          <DrawerBody>
            {/* TABS */}
            <Tabs size="md" variant="enclosed">
              <TabList>
                <Tab>
                  Reviews (
                  {article !== undefined ? article.reviews.length : "..."})
                </Tab>
                <Tab>
                  Comments (
                  {article !== undefined ? article.comments.length : "..."})
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ReviewList article={article} />
                </TabPanel>
                <TabPanel>
                  <CommentList on={article} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>

          <DrawerFooter>Footer !</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Article
