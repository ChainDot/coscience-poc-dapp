import {
  Box,
  Flex,
  Text,
  Spacer,
  UnorderedList,
  Input,
  Button,
  IconButton,
  Heading,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useClipboard,
  Link,
} from "@chakra-ui/react"
import { SettingsIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useUsersContract } from "../hooks/useUsersContract"
import { useReviewsContract } from "../hooks/useReviewsContract"
import { useCommentsContract } from "../hooks/useCommentsContract"
import Loading from "./Loading"
import Accordion from "./Accordion"
import UserSetting from "./UserSetting"
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
  const [, connectedUser] = useUsersContract()
  const [articles, , , createArticleList] = useArticlesContract()
  const [reviews, , createReviewList] = useReviewsContract()
  const [comments, , createCommentList] = useCommentsContract()
  const [, readIFPS] = useIPFS()

  const [articleList, setArticleList] = useState()
  const [reviewList, setReviewList] = useState()
  const [commentList, setCommentList] = useState()

  const [value, setValue] = useState()
  const { hasCopied, onCopy } = useClipboard(value)
  const [isOpen, setIsOpen] = useState()
  const onClose = () => setIsOpen(false)
  const [isOpenSetting, setIsOpenSetting] = useState()
  const onCloseSetting = () => setIsOpenSetting(false)

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
  }, [
    user,
    articles,
    createArticleList,
    comments,
    createCommentList,
    reviews,
    createReviewList,
    readIFPS,
  ])

  return (
    <>
      <Box px="10">
        <Flex alignItems="center">
          <Spacer />
          <Box me="4" p="2" borderRadius="10" bg="messenger.100">
            <Text>ID: {user.id} </Text>
          </Box>
          <Box
            p="2"
            borderRadius="10"
            bg={
              user.status === "Pending"
                ? "orange.200"
                : user.status === "Approved"
                ? "green.200"
                : "red"
            }
            me="4"
          >
            <Text>Status: {user.status} </Text>
          </Box>
          {Number(user.id) === connectedUser.id ? (
            <IconButton
              colorScheme="teal"
              aria-label="Call Segun"
              size="lg"
              icon={<SettingsIcon />}
              onClick={setIsOpenSetting}
              borderRadius="100"
            />
          ) : (
            ""
          )}
        </Flex>
      </Box>

      {/* SETTINGS MODAL */}
      <Modal size="lg" isOpen={isOpenSetting} onClose={onCloseSetting}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <UserSetting user={user} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* USER PROFILE */}
      <Heading my="4" as="h2">
        {user.firstName} {user.lastName}{" "}
        <Link
          isTruncated
          isExternal
          href={`https://ipfs.io/ipfs/${user.profileCID}`}
          color="teal"
          fontWeight="bold"
        >
          (See on IPFS)
        </Link>
      </Heading>

      {/* user.info ? = FALSE CID : OBJECT FROM IPFS
      
      1. useIPFS.js: function readIPFS throw CID if false
      2. Profile.js: useEffect try to fetch IPFS with user.profileCID (readIPFS(user.profileCID))
      3. Profile.js: wrong CIDs are catched in the key .info
      4. SO: user.info === user.profileCID if the CID is false
      */}
      <Text>E-mail: {user.email}</Text>
      <Text>Laboratory: {user.laboratory}</Text>
      <Text fontWeight="bold">Bio:</Text>
      <Text>{user.bio}</Text>

      <Button
        my="6"
        rounded={"full"}
        px={6}
        colorScheme={"orange"}
        bg={"orange.400"}
        onClick={setIsOpen}
      >
        Wallet List
      </Button>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Here your Wallet List</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <UnorderedList listStyleType="none">
              {user.walletList !== undefined
                ? user.walletList.map((wallet) => {
                    return (
                      <Flex key={wallet} as="li" mb={2}>
                        <Input
                          onClick={(e) => setValue(e.target.value)}
                          value={wallet}
                          isReadOnly
                          placeholder="test"
                        />
                        <Button
                          disabled={value !== wallet}
                          onClick={onCopy}
                          ml={2}
                        >
                          {hasCopied ? "Copied" : "Copy"}
                        </Button>
                      </Flex>
                    )
                  })
                : ""}
            </UnorderedList>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab fontSize="2xl">
            Articles ({articleList !== undefined ? articleList.length : "..."})
          </Tab>
          <Tab fontSize="2xl">
            Reviews ({reviewList !== undefined ? reviewList.length : "..."})
          </Tab>
          <Tab fontSize="2xl">
            Comments ({commentList !== undefined ? commentList.length : "..."})
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
    </>
  )
}

export default Dashboard
