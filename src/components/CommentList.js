import { Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useCommentsContract } from '../hooks/useCommentsContract'
import { useIPFS } from '../hooks/useIPFS'
import { useUsersContract } from '../hooks/useUsersContract'
import Comment from './Comment'
import Loading from './Loading'

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
  const { comments, createCommentList, commentEvents } = useCommentsContract()
  const { users } = useUsersContract()
  const [, readIPFS] = useIPFS()

  const [commentList, setCommentList] = useState()

  // get comment data
  useEffect(() => {
    if ((comments && on !== undefined, commentEvents)) {
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

            // update vote review when listening to event Voted
            comments.on(nbCommentVote, commentData)

            // user info
            const authorID = await users.profileID(comment.author)
            const struct = await users.userInfo(authorID)
            const { firstName, lastName } = await readIPFS(struct.nameCID)

            // event info
            const { txHash, timestamp, blockNumber, date } =
              commentEvents[comment.id]

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
              vote,
              nbVotes
            }
          })
        )
        setCommentList(asyncRes)
        return () => {
          comments.off(nbCommentVote, commentData)
        }
      }
      commentData()
    }

    return () => {
      setCommentList(undefined)
    }
  }, [on, comments, createCommentList, readIPFS, users, commentEvents])

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
