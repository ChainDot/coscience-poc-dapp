import { Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useCommentsContract } from "../hooks/useCommentsContract"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"
import Comment from "./Comment"
import SendComment from "./SendComment"

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

const CommentList = ({ article }) => {
  const [comments, , createCommentList, eventList] = useCommentsContract()
  const [users] = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [commentList, setCommentList] = useState()

  // get comment data
  useEffect(() => {
    if ((comments && article !== undefined, eventList)) {
      const commentData = async () => {
        const listOfId = await articleCommentIds(comments, article)
        const commentList = await createCommentList(comments, listOfId)
        const asyncRes = await Promise.all(
          commentList.map(async (comment) => {
            // get content from IPFS
            const { content } = await readIPFS(comment.contentCID)

            // user info
            const authorID = await users.profileID(comment.author)
            const nameCID = await users.userName(authorID)
            const { firstName, lastName } = await readIPFS(nameCID)

            // event info
            const { txHash, timestamp, blockNumber, date } =
              eventList[comment.id]

            return {
              ...comment,
              content,
              authorID,
              firstName,
              lastName,
              txHash,
              timestamp,
              blockNumber,
              date,
            }
          })
        )
        setCommentList(asyncRes)
      }
      commentData()
    }

    return () => {
      setCommentList(undefined)
    }
  }, [article, comments, createCommentList, readIPFS, users, eventList])

  return (
    <>
      {commentList !== undefined
        ? commentList.map((comment) => {
            return (
              <Box key={comment.id}>
                <Comment comment={comment} />
                <SendComment id={comment.id} targetAddress={comments.address} />
              </Box>
            )
          })
        : ""}
    </>
  )
}

export default CommentList
