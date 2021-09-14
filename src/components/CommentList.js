import { Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useCommentsContract } from "../hooks/useCommentsContract"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"
import Comment from "./Comment"
import Loading from "./Loading"

const onCommentIds = async (comments, on) => {
  if (comments) {
    const nb = on.comments.length
    const listOfId = []

    for (let i = 0; i < nb; i++) {
      const id = await on.comments[i]
      listOfId.push(id.toNumber())
    }
    return listOfId
  }
}

const CommentList = ({ on }) => {
  const { comments, createCommentList } = useCommentsContract()
  const { users } = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [commentList, setCommentList] = useState()

  // get comment data
  useEffect(() => {
    const commentData = async () => {
      const listOfId = await onCommentIds(comments, on)
      const commentList = await createCommentList(comments, listOfId)
      let nbCommentVote
      const asyncRes = await Promise.all(
        commentList.map(async (comment) => {
          // get content from IPFS
          const { content } = await readIPFS(comment.contentCID)

          //get comment vote
          const structComment = await comments.commentInfo(comment.id)
          const { vote, id } = structComment

          // nb of vote
          nbCommentVote = await comments.filters.Voted(Number(id), null)

          const eventArray = await comments.queryFilter(nbCommentVote)
          const nbVotes = eventArray.length

          // user info
          const authorID = await users.profileID(comment.author)
          const struct = await users.userInfo(authorID)
          const { firstName, lastName } = await readIPFS(struct.nameCID)

          // event information
          let commentEvent = await comments.filters.Posted(
            null,
            comment.id,
            null
          )
          commentEvent = await comments.queryFilter(commentEvent)
          const block = await commentEvent[0].getBlock()
          const date = new Date(block.timestamp * 1000)

          return {
            ...comment,
            content,
            authorID,
            firstName,
            lastName,
            txHash: commentEvent[0].transactionHash,
            timestamp: block.timestamp,
            blockNumber: commentEvent[0].blockNumber,
            date: date.toLocaleString(),
            vote,
            nbVotes
          }
        })
      )
      setCommentList(asyncRes)
    }
    if (comments && on !== undefined) {
      commentData()
      comments.on("Voted", commentData)
    }

    return () => {
      setCommentList(undefined)
      comments?.off("Voted", commentData)
    }
  }, [on, comments, createCommentList, readIPFS, users])

  return (
    <>
      {commentList !== undefined ? (
        commentList.map((comment) => {
          return (
            <Box key={comment.id}>
              <Comment comment={comment} />
            </Box>
          )
        })
      ) : (
        <Loading />
      )}
    </>
  )
}

export default CommentList
