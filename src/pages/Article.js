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
  TabPanel,
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

const Article = () => {
  const { id } = useParams()
  const [articles, , getArticleData, , eventList] = useArticlesContract()
  const [users] = useUsersContract()

  const [, readIPFS] = useIPFS()

  const [article, setArticle] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  // get data of the displayed article
  useEffect(() => {
    if (articles) {
      const articleData = async () => {
        const articleObj = await getArticleData(articles, id)

        // get content
        const { title, abstract } = await readIPFS(articleObj.abstractCID)
        const { content } = await readIPFS(articleObj.contentCID)

        // get user info
        const idAuthor = await users.profileID(articleObj.author)
        const nameCID = await users.userName(idAuthor)
        const { firstName, lastName } = await readIPFS(nameCID)
        const profileCID = await users.userProfile(idAuthor)
        const { laboratory } = await readIPFS(profileCID)

        // get co author info
        let coAuthors = []
        for (const coAuthor of articleObj.coAuthor) {
          const coAuthorId = await users.profileID(coAuthor)
          if (coAuthorId !== 0) {
            const nameCID = await users.userName(coAuthorId)
            const { firstName, lastName } = await readIPFS(nameCID)
            const profileCID = await users.userProfile(coAuthorId)
            const { laboratory } = await readIPFS(profileCID)
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
          authorID: idAuthor,
          firstName,
          lastName,
          laboratory,
          coAuthors, // coAuthor: [{coAuthorId, firstName, lastName, laboratory},{}]
        })
      }
      articleData()
    }
  }, [articles, getArticleData, id, readIPFS, users])

  const bg = useColorModeValue("white", "gray.800")
  // --------------------------------------------------------------RETURN
  return (
    <>
      <Box shadow="lg" bg={bg}>
        <ArticleHeader id={id} article={article} eventList={eventList} />
        <Container py="10" maxW="container.xl">
          {article ? (
            article.id !== 0 ? (
              <>
                <Box key={article.id}>
                  <Heading fontSize="8xl" textAlign="center">
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
                  <Text textAlign="center">Not implemented yet...</Text>
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
          <Flex>
            <Button onClick={onOpen} colorScheme="teal" me="4">
              Reviews ({article !== undefined ? article.reviews.length : "..."})
            </Button>
            <Button onClick={onOpen} colorScheme="teal">
              Comments (
              {article !== undefined ? article.comments.length : "..."})
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* DRAWER */}
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        placement="bottom"
        size="xl"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Reviews & Comments</DrawerHeader>

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
                  <CommentList article={article} />
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
