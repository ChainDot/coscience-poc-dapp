import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SlideFade
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useReviewsContract } from "../hooks/useReviewsContract"
import { useCommentsContract } from "../hooks/useCommentsContract"
import Loading from "./Loading"
import Accordion from "./Accordion"

import { useIPFS } from "../hooks/useIPFS"

const userContractIds = async (contract, user) => {
  if (contract) {
    const nb = user.walletList.length
    const listOfId = []

    for (let i = 0; i < nb; i++) {
      const address = user.walletList[i]
      const balance = await contract.balanceOf(address) // ERC721 => 0 -> balance
      for (let i = 0; i < balance; i++) {
        const id = await contract.tokenOfOwnerByIndex(address, i)
        listOfId.push(id.toNumber())
      }
    }

    // ERC721Enumerable
    // tokenOfOwnerByIndex(address,index): mapping(uint256 balance => uint256 tokenID)
    return listOfId
  }
}

const Dashboard = ({ user }) => {
  const { articles, createArticleList } = useArticlesContract()
  const { reviews, createReviewList } = useReviewsContract()
  const { comments, createCommentList } = useCommentsContract()
  const [, readIFPS] = useIPFS()

  const [articleList, setArticleList] = useState()
  const [reviewList, setReviewList] = useState()
  const [commentList, setCommentList] = useState()

  // try to export that in a hook
  useEffect(() => {
    // anonymous function
    ;(async () => {
      // list of articles
      let listOfId = await userContractIds(articles, user)
      const articleList = await createArticleList(articles, listOfId)
      // get ipfs info of articles
      const ipfsArticleInfo = await Promise.all(
        articleList.map(async (article) => {
          const { title, abstract } = await readIFPS(article.abstractCID) // destructuring the ipfs content
          return { ...article, title, abstract }
        })
      )
      setArticleList(ipfsArticleInfo)

      // list of reviews
      listOfId = await userContractIds(reviews, user)
      const reviewList = await createReviewList(reviews, listOfId)
      const ipfsReviewInfo = await Promise.all(
        reviewList.map(async (review) => {
          const { title, content } = await readIFPS(review.contentCID)
          return { ...review, title, content }
        })
      )
      setReviewList(ipfsReviewInfo)

      // list of comments
      listOfId = await userContractIds(comments, user)
      const commentList = await createCommentList(comments, listOfId)
      const ipfsCommentInfo = await Promise.all(
        commentList.map(async (comment) => {
          const { content } = await readIFPS(comment.contentCID)
          return { ...comment, content }
        })
      )
      setCommentList(ipfsCommentInfo)
    })()
    return () => {
      setCommentList()
      setReviewList()
      setArticleList()
    }
  }, [
    user,
    articles,
    createArticleList,
    comments,
    createCommentList,
    reviews,
    createReviewList,
    readIFPS
  ])

  return (
    <>
      <SlideFade
        threshold="0.1"
        delay={{ enter: 0.1 }}
        transition={{
          enter: { duration: 0.7 }
        }}
        offsetY="100px"
        offsetX="0px"
        in
      >
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab fontSize="2xl">
              Articles ({articleList !== undefined ? articleList.length : "..."}
              )
            </Tab>
            <Tab fontSize="2xl">
              Reviews ({reviewList !== undefined ? reviewList.length : "..."})
            </Tab>
            <Tab fontSize="2xl">
              Comments ({commentList !== undefined ? commentList.length : "..."}
              )
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* ARTICLE LIST */}
              {articleList === undefined ? (
                <Loading />
              ) : (
                articleList.map((article) => {
                  return (
                    <Box key={article.id}>
                      <Accordion object={article} type="Article" />
                    </Box>
                  )
                })
              )}
            </TabPanel>
            <TabPanel>
              {/* REVIEW LIST */}
              {reviewList === undefined ? (
                <Loading />
              ) : (
                reviewList.map((review) => {
                  return (
                    <Box key={review.id}>
                      <Accordion object={review} type="Review" />
                    </Box>
                  )
                })
              )}
            </TabPanel>
            <TabPanel>
              {/* COMMENT LIST */}
              {commentList === undefined ? (
                <Loading />
              ) : (
                commentList.map((comment) => {
                  return (
                    <Box key={comment.id}>
                      <Accordion object={comment} type="Comment" />
                    </Box>
                  )
                })
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SlideFade>
    </>
  )
}

export default Dashboard
