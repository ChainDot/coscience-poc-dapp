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
  useDisclosure,
  CircularProgressLabel,
  CircularProgress,
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

  const [index, setIndex] = useState(0)
  const [banVote, setBanVote] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  // get data of the displayed article
  useEffect(() => {
    const articleData = async () => {
      const articleObj = await getArticleData(articles, id)

      const isBanned = articleObj.contentBanned

      // get number of voters
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
        validityVotes,
        importanceVotes,
        isBanned
      })
    }
    if (articles) {
      articleData()
      // listen the event with the filter
      articles.on("ImportanceVoted", articleData)
      articles.on("ValidityVoted", articleData)
      reviews?.on("Posted", articleData)
      comments?.on("Posted", articleData)
    }
    return () => {
      setArticle()
      articles?.off("ImportanceVoted", articleData)
      articles?.off("ValidityVoted", articleData)
      reviews?.off("Posted", articleData)
      comments?.off("Posted", articleData)
    }
  }, [articles, getArticleData, id, readIPFS, users, reviews, comments])

  // check governance for ban the article
  useEffect(() => {
    const getBanVotes = async () => {
      let nbOfBanVote = await governance.filters.Voted(
        articles.address,
        Number(id),
        null
      )
      nbOfBanVote = await governance.queryFilter(nbOfBanVote)
      setBanVote(nbOfBanVote.length)
    }
    if (governance) {
      getBanVotes()
      governance.on("Voted", getBanVotes)
    }
    return () => {
      setBanVote(0)
      governance?.off("Voted", getBanVotes)
    }
  }, [governance, articles, id])

  // ban
  async function banArticle(id) {
    await contractCall(articles, "banArticle", [id])
  }

  async function voteToBanArticle(id) {
    await contractCall(governance, "voteToBanArticle", [id])
  }

  function openDrawer(index) {
    setIndex(index)
    onOpen()
  }

  //                  Color Value
  const bg = useColorModeValue("white", "grayOrange.900")
  const txt = useColorModeValue("main", "second")
  const scheme = useColorModeValue("colorMain", "colorSecond")
  const bgdrawer = useColorModeValue("grayOrange.100", "grayBlue.800")

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
              article?.isBanned ? (
                <Text>Article n°{article.id} has been Banned</Text>
              ) : (
                <>
                  <Box>
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
                        aria-label="author profile redirection button"
                      >
                        {article.firstName} {article.lastName}
                      </Link>
                      <Text as="sup"> 1 </Text>,{" "}
                      {article.coAuthors.map((coAuthor, index) => {
                        return (
                          <Box as="span" key={coAuthor.id}>
                            <Link
                              as={RouterLink}
                              to={`/profile/${coAuthor.id}`}
                              aria-label="coAuthor profile redirection button"
                            >
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
                    {article?.pdfFile !== "No PDF joined" ? (
                      <Button
                        as={Link}
                        isExternal
                        href={`https://ipfs.io/ipfs/${article.pdfFile}`}
                        mt="4"
                        variant="link"
                        color={txt}
                        aria-label="pdf article content link"
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
                    {article.content ? (
                      <Text my="4">{article.content}</Text>
                    ) : (
                      <Text color="gray">
                        IPFS cannot be read at this time, try later
                      </Text>
                    )}

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
                        onClick={() => openDrawer(0)}
                        colorScheme={scheme}
                        me="4"
                        variant="link"
                        aria-label="reviews drawer button"
                      >
                        Reviews (
                        {article !== undefined ? article.reviews.length : "..."}
                        )
                      </Button>
                      <Button
                        onClick={() => openDrawer(1)}
                        colorScheme={scheme}
                        variant="link"
                        aria-label="comments drawer button"
                      >
                        Comments (
                        {article !== undefined
                          ? article.comments.length
                          : "..."}
                        )
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
                    <Box>
                      {/*Owner Options */}
                      {owner !== governance?.address ? (
                        isOwner ? (
                          <Button
                            onClick={() => banArticle(id)}
                            isLoading={
                              status.startsWith("Waiting") ||
                              status.startsWith("Pending")
                            }
                            loadingText={status}
                            disabled={
                              status.startsWith("Waiting") ||
                              status.startsWith("Pending")
                            }
                            aria-label="ban button"
                          >
                            Ban
                          </Button>
                        ) : (
                          ""
                        )
                      ) : (
                        <>
                          <Button
                            colorScheme="red"
                            variant="outline"
                            onClick={() => voteToBanArticle(id)}
                            isLoading={
                              status.startsWith("Waiting") ||
                              status.startsWith("Pending")
                            }
                            loadingText={status}
                            disabled={
                              status.startsWith("Waiting") ||
                              status.startsWith("Pending")
                            }
                            aria-label="ban vote article button"
                          >
                            Vote to ban this article
                          </Button>
                          {banVote ? (
                            <CircularProgress
                              ms="4"
                              value={banVote}
                              max="5"
                              color="red"
                            >
                              <CircularProgressLabel>
                                {banVote}/5
                              </CircularProgressLabel>
                            </CircularProgress>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </>
              )
            ) : (
              <Heading textAlign="center">
                Oups this article doesn't exist
              </Heading>
            )
          ) : (
            <Loading />
          )}
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
        <DrawerContent maxH="60vh" bg={bgdrawer}>
          <DrawerCloseButton />
          <DrawerHeader shadow="sm">Reviews & Comments</DrawerHeader>

          <DrawerBody>
            {/* TABS */}
            <Tabs defaultIndex={index} size="md" variant="enclosed">
              <TabList>
                <Tab aria-label="tab reviews">
                  Reviews (
                  {article !== undefined ? article.reviews.length : "..."})
                </Tab>
                <Tab aria-label="tab comments">
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
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Article
