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
} from "@chakra-ui/react"
import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useCommentsContract } from "../hooks/useCommentsContract"
import { useIPFS } from "../hooks/useIPFS"
import { useReviewsContract } from "../hooks/useReviewsContract"
import { useUsersContract } from "../hooks/useUsersContract"
import Loading from "../components/Loading"
import SendComment from "../components/SendComment"

import SendReview from "../components/SendReview"

const articleReviewIds = async (reviews, article) => {
  if (reviews) {
    const nb = article.reviews.length
    const listOfId = []

    for (let i = 0; i < nb; i++) {
      const id = await article.reviews[i]
      listOfId.push(id.toNumber())
    }
    return listOfId
  }
}

const articleCommentIds = async (comments, article) => {
  if (comments) {
    const nb = article.comments.length
    const listOfId = []

    for (let i = 0; i < nb; i++) {
      const id = await article.comments[i]
      listOfId.push(id.toNumber())
    }
    return listOfId
  }
}

const Article = () => {
  const { id } = useParams()
  const [articles, , getArticleData] = useArticlesContract()
  const [reviews, , createReviewsList] = useReviewsContract()
  const [comments, , createCommentList] = useCommentsContract()
  const [users] = useUsersContract()

  const [, readIPFS] = useIPFS()

  const [article, setArticle] = useState()

  const [articlesReviewList, setArticlesReviewList] = useState()
  const [articlesCommentList, setArticlesCommentList] = useState()

  const [on, setOn] = useState()

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

        setArticle({
          ...articleObj,
          title,
          abstract,
          content,
          firstName,
          lastName,
        })
      }
      articleData()
    }
  }, [articles, getArticleData, id, readIPFS, users])

  // get review data
  useEffect(() => {
    if (reviews && article !== undefined) {
      const reviewData = async () => {
        const listOfId = await articleReviewIds(reviews, article)
        const reviewList = await createReviewsList(reviews, listOfId)

        const asyncRes = await Promise.all(
          reviewList.map(async (review) => {
            const { title, content } = await readIPFS(review.contentCID)
            const idAuthor = await users.profileID(review.author)
            const nameCID = await users.userName(idAuthor)
            const { firstName, lastName } = await readIPFS(nameCID)
            return { ...review, title, content, firstName, lastName }
          })
        )

        setArticlesReviewList(asyncRes)
      }
      reviewData()
    }
  }, [reviews, article, readIPFS, createReviewsList, users])

  // get comment data
  useEffect(() => {
    if (comments && article !== undefined) {
      const commentData = async () => {
        const listOfId = await articleCommentIds(comments, article)
        const commentList = await createCommentList(comments, listOfId)
        // get comments content from IPFS
        const asyncRes = await Promise.all(
          commentList.map(async (comment) => {
            const { content } = await readIPFS(comment.contentCID)
            const idAuthor = await users.profileID(comment.author)
            const nameCID = await users.userName(idAuthor)
            const { firstName, lastName } = await readIPFS(nameCID)

            return { ...comment, content, firstName, lastName }
          })
        )
        setArticlesCommentList(asyncRes)
      }
      commentData()
    }

    return () => {
      setArticlesCommentList(undefined)
    }
  }, [article, comments, createCommentList, readIPFS, users])

  function handleOpenDrawer(targetAddress, obj) {
    // is Review or Comment?
    ;(async () => {
      const commentList = await createCommentList(comments, obj.comments) // obj.comments = [id,id,id]
      // get comments content from IPFS
      const asyncRes = await Promise.all(
        commentList.map(async (comment) => {
          const { content } = await readIPFS(comment.contentCID)
          return { ...comment, content }
        })

        // CRAWLER
        // add 'anchor'
        // path function
        // article/:id/review/:id/comment/:id/comment/:id
        // article/:id/comment/:id

        // comment/:id => path
        // commentID => commentID => reviewID => articleID
      )

      obj = { ...obj, comments: asyncRes }
      setOn({ targetAddress, obj })
    })()

    if (!isOpen) {
      onOpen()
    }
  }

  const bg = useColorModeValue("white", "gray.800")
  // --------------------------------------------------------------RETURN
  return (
    <>
      <Box py="10" bg={bg}>
        <Container maxW="container.xl">
          {article ? (
            article.id !== 0 ? (
              <>
                <Box key={article.id}>
                  <Heading textAlign="center">{article.title}</Heading>
                  <Text>ID : {article.id}</Text>
                  <Text>
                    Author: {article.firstName} {article.lastName}
                  </Text>
                  <Text>Author address: {article.author} </Text>
                  <Text>CoAuthor: {article.CoAuthor} </Text>
                  <Text>Content banned: {`${article.contentBanned}`} </Text>
                  <Text my="4">Abstract: {article.abstract}</Text>
                  <Link
                    color="blue"
                    isExternal
                    href={`https://ipfs.io/ipfs/${article.abstractCID}`}
                  >
                    See on IPFS
                  </Link>
                  <Text my="4">Content: {article.content}</Text>
                  <Link
                    color="blue"
                    isExternal
                    href={`https://ipfs.io/ipfs/${article.contentCID}`}
                  >
                    See on IPFS
                  </Link>
                  <Text>Nb of reviews: {article.reviews.length} </Text>
                  <Text>Nb of comments: {article.comments.length} </Text>
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

          {/* REVIEWS LIST */}
          {articlesReviewList === undefined ? (
            <Loading />
          ) : (
            <>
              <Heading as="h3" mt="5">
                Reviews({articlesReviewList.length})
              </Heading>
              {articlesReviewList.map((review) => {
                return (
                  <Box key={review.id}>
                    <Heading
                      onClick={() => handleOpenDrawer(reviews.address, review)}
                      _hover={{ textDecoration: "underline" }}
                    >
                      {review.title}
                    </Heading>
                    <Text>ID : {review.id}</Text>
                    <Text>
                      Author: {review.firstName} {review.lastName}
                    </Text>
                    <Text>Author Address: {review.author} </Text>
                    <Link
                      color="blue"
                      isExternal
                      href={`https://ipfs.io/ipfs/${review.contentCID}`}
                    >
                      See on IPFS: {review.contentCID}
                    </Link>
                    <Text>Content: {review.content}</Text>
                    <Text>Content banned: {`${review.contentBanned}`} </Text>
                    <Text>articleID: {review.targetID} </Text>
                    <Text>Nb of comment(s): {review.comments.length} </Text>
                  </Box>
                )
              })}
            </>
          )}
          <SendReview id={id} />

          {/* COMMENTS LIST */}
          {articlesCommentList === undefined ? (
            <Loading />
          ) : (
            <>
              <Heading as="h3" mt="5">
                Comments({articlesCommentList.length})
              </Heading>
              {articlesCommentList.map((comment) => {
                return (
                  <Box key={comment.id}>
                    <Heading
                      onClick={() =>
                        handleOpenDrawer(comments.address, comment)
                      }
                      _hover={{ textDecoration: "underline" }}
                    >
                      Comment n°{comment.id}
                    </Heading>
                    <Text>ID : {comment.id}</Text>
                    <Text>
                      Author: {comment.firstName} {comment.lastName}
                    </Text>
                    <Text>Author address: {comment.author} </Text>
                    <Text>contentCID: {comment.contentCID} </Text>
                    <Text>Content: {comment.content}</Text>
                    <Text>Comment banned: {`${comment.contentBanned}`} </Text>
                    <Text>ArticleID: {comment.targetID} </Text>
                    <Text>Nb of comment(s): {comment.comments.length} </Text>
                  </Box>
                )
              })}
            </>
          )}

          <SendComment
            disabled={articles === undefined}
            targetAddress={articles ? articles.address : ""}
            id={id}
          />
        </Container>
      </Box>

      {/* DRAWER */}
      {on !== undefined ? (
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
            <DrawerHeader>
              {on.targetAddress === reviews.address ? "Review" : "Comment"} n°
              {on.obj.id}
            </DrawerHeader>

            <DrawerBody>
              <Heading>
                {on.targetAddress === reviews.address
                  ? on.obj.title
                  : `Comment n°${on.obj.id}`}
              </Heading>
              <Text>
                {on.obj.firstName} {on.obj.lastName}{" "}
              </Text>
              <Text>Author address: {on.obj.author} </Text>
              <Text>
                Content:
                {on.obj.content}
              </Text>
              <Text>
                Content banned: {on.obj.contentBanned ? "true" : "false"}{" "}
              </Text>

              <Text>
                On{" "}
                {on.targetAddress === reviews.address
                  ? "Review"
                  : on.targetAddress === articles.address
                  ? "Article"
                  : "Comment"}{" "}
                n°{on.obj.targetID}
              </Text>
              <Text>Nb of comment(s): {on.obj.comments.length} </Text>

              {/* COMMENTS OF THIS REVIEW / COMMENT */}
              {/* GET INFO FROM IPFS HERE, need a async mapping... */}
              {on.obj.comments.length === 0 ? (
                <Text fontSize="3xl">There is no comments here</Text>
              ) : (
                on.obj.comments.map((comment) => {
                  return (
                    <Box key={comment.id}>
                      <Heading
                        onClick={() =>
                          handleOpenDrawer(comments.address, comment)
                        }
                        _hover={{ textDecoration: "underline" }}
                      >
                        Comment n°{comment.id}{" "}
                      </Heading>
                      <Text>Author: {comment.author} </Text>
                      <Text>contentCID: {comment.contentCID} </Text>

                      {/* WHERE COME FROM THE CONTENT ??? */}
                      <Text>
                        Content:{" "}
                        {comment.content.comment === undefined
                          ? comment.content
                          : comment.content.comment}{" "}
                      </Text>
                      <Text>Comment banned: {comment.contentBanned} </Text>
                      <Text>Nb of comment(s): {comment.comments.length} </Text>
                    </Box>
                  )
                })
              )}
              <SendComment targetAddress={on.targetAddress} id={on.obj.id} />
            </DrawerBody>

            <DrawerFooter>
              <Text>
                {on.targetAddress === reviews.address ? "Review" : "Comment"} n°
                {on.obj.id}
              </Text>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        ""
      )}
    </>
  )
}

export default Article
