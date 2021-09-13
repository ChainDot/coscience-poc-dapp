import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Input,
  Heading,
  useDisclosure,
  Collapse,
  useColorModeValue
} from '@chakra-ui/react'
import { useState } from 'react'
import { useIPFS } from '../hooks/useIPFS'

import { useReviewsContract } from '../hooks/useReviewsContract'
import { useCall } from '../web3hook/useCall'

const SendReview = ({ id }) => {
  const { reviews } = useReviewsContract()
  const [status, contractCall] = useCall()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [pinJsObject, , ipfsStatus, , unPin] = useIPFS()
  const { isOpen, onToggle } = useDisclosure()

  async function post() {
    const reviewObj = { version: 0.1, title, content }
    const reviewHash = await pinJsObject(reviewObj)
    // post(review, articleID)
    const tx = await contractCall(reviews, 'post', [reviewHash, id])

    // unpin
    if (tx === 'Error') {
      await unPin(reviewHash)
    }
    setTitle('')
    setContent('')
  }

  const scheme = useColorModeValue('colorMain', 'colorSecond')

  return (
    <>
      <Box minW='49%'>
        <Button onClick={onToggle} colorScheme={scheme}>
          {isOpen ? 'X' : 'Add review'}
        </Button>

        <Box mb='4' mx='auto' display='flex' flexDirection='column'>
          <Collapse in={isOpen} animateOpacity>
            <Box p='40px' mt='4' rounded='md' shadow='md'>
              <Heading>Write a review</Heading>
              <FormControl mb='4'>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  placeholder='Your review title...'
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl mb='4'>
                <FormLabel>Content</FormLabel>
                <Textarea
                  value={content}
                  placeholder='Your review...'
                  onChange={(e) => setContent(e.target.value)}
                />
              </FormControl>
              <Button
                colorScheme={scheme}
                onClick={post}
                isLoading={
                  status.startsWith('Waiting') ||
                  status.startsWith('Pending') ||
                  ipfsStatus.startsWith('Pinning')
                }
                loadingText={
                  ipfsStatus.startsWith('Pinning') ? ipfsStatus : status
                }
                disabled={
                  !title.length ||
                  !content.length ||
                  status.startsWith('Waiting') ||
                  status.startsWith('Pending') ||
                  ipfsStatus.startsWith('Pinning')
                }
              >
                Submit
              </Button>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </>
  )
}

export default SendReview
