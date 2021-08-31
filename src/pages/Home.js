import { Box, useColorModeValue, Container } from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import ArticleList from "../components/ArticleList"
import CallToAction from "../components/CallToAction"
import Loading from "../components/Loading"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"

const Home = () => {
  const [, articleList] = useArticlesContract()
  const [users] = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [articleListAuthor, setArticleListAuthor] = useState()

  const bg = useColorModeValue("white", "gray.800")

  useEffect(() => {
    if (users && articleList !== undefined) {
      ;(async () => {
        const asyncRes = await Promise.all(
          articleList.map(async (article) => {
            const userID = await users.profileID(article.author)
            const { title, abstract } = await readIPFS(article.abstractCID)
            const nameCID = await users.userName(userID)
            const { firstName, lastName } = await readIPFS(nameCID)
            return {
              ...article,
              authorID: userID.toNumber(),
              title,
              abstract,
              firstName,
              lastName,
            }
          })
        )
        setArticleListAuthor(asyncRes)
      })()
    }
  }, [users, articleList, readIPFS])

  return (
    <>
      <CallToAction />
      <Box py="10" bg={bg}>
        <Container maxW={{ base: "container.sm", lg: "container.xl" }}>
          {articleListAuthor === undefined ? (
            <Loading />
          ) : articleListAuthor.length === 0 ? (
            <Loading />
          ) : (
            <ArticleList articleList={articleListAuthor} />
          )}
        </Container>
      </Box>
    </>
  )
}

export default Home
