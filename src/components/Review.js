import { InfoIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Divider,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  CircularProgressLabel,
  CircularProgress,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
  Collapse
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useGovernanceContract } from '../hooks/useGovernanceContract'
import { useReviewsContract } from '../hooks/useReviewsContract'
import { useUsersContract } from '../hooks/useUsersContract'
import { useCall } from '../web3hook/useCall'
import CommentList from './CommentList'
import SendComment from './SendComment'
import VoteOnReview from './VoteOnReview'

const Review = ({ review }) => {
  const link = useColorModeValue('main', 'second')
  const { reviews } = useReviewsContract()

  const { governance } = useGovernanceContract()
  const { owner, isOwner } = useUsersContract()
  const [status, contractCall] = useCall()

  const [banVote, setBanVote] = useState(0)

  const { isOpen, onToggle } = useDisclosure()
  const scheme = useColorModeValue('colorMain', 'colorSecond')

  // get governance informations (ban)
  useEffect(() => {
    const getBanVotes = async () => {
      let nbOfBanVote = await governance.filters.Voted(
        reviews.address,
        Number(review.id),
        null
      )
      nbOfBanVote = await governance.queryFilter(nbOfBanVote)
      setBanVote(nbOfBanVote.length)
    }
    if (governance) {
      getBanVotes()
      governance.on('Voted', getBanVotes)
    }
    return () => {
      setBanVote(0)
      governance?.off('Voted', getBanVotes)
    }
  }, [governance, reviews, review.id])

  async function banPost(id) {
    await contractCall(reviews, 'banPost', [id])
  }

  async function voteToBanReview(id) {
    await contractCall(governance, 'voteToBanReview', [id])
  }

  return (
    <Box p='5' key={review.id}>
      {review !== undefined ? (
        review.contentBanned ? (
          <Text>Review n°{review.id} has been Banned</Text>
        ) : (
          <>
            <Flex
              flexDirection={{ base: 'column', lg: 'row' }}
              justifyContent={{ base: 'start', lg: 'space-between' }}
            >
              <Box>
                <Heading as='h2'>{review.title}</Heading>

                <Text>
                  by{' '}
                  <Link
                    as={RouterLink}
                    color={link}
                    to={`/profile/${review.authorID}`}
                    aria-label='author profile redirection'
                  >
                    {review.firstName} {review.lastName}
                  </Link>{' '}
                  | {review.date} | {review.comments.length} comments
                </Text>
              </Box>

              <Box textAlign={{ base: 'start', lg: 'end' }}>
                <Heading as='h2' fontSize='xl'>
                  Review #{review.id}
                </Heading>
                <Flex alignItems='center'>
                  <Text>Blockchain Informations</Text>
                  <Box>
                    <Popover placement='top-start'>
                      <PopoverTrigger>
                        <IconButton
                          variant='Link'
                          color={link}
                          icon={<InfoIcon />}
                          aria-label='info button'
                        />
                      </PopoverTrigger>
                      <PopoverContent w='100%' textAlign='start' p='2'>
                        <PopoverHeader fontWeight='semibold'>
                          Blockchain Informations
                        </PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                          <Text>
                            Address of author: {review.author}{' '}
                            <Link
                              color={link}
                              isExternal
                              href={`https://rinkeby.etherscan.io/address/${review.author}`}
                              aria-label='etherscan redirection'
                            >
                              (Etherscan)
                            </Link>{' '}
                          </Text>
                          <Text>
                            Mined in block n° {review.blockNumber}{' '}
                            <Link
                              color={link}
                              isExternal
                              href={`https://rinkeby.etherscan.io/txs?block=${review.blockNumber}`}
                              aria-label='etherscan redirection'
                            >
                              (Etherscan)
                            </Link>{' '}
                          </Text>

                          <Text>
                            Transaction hash: {review.txHash}{' '}
                            <Link
                              color={link}
                              isExternal
                              href={`https://rinkeby.etherscan.io/tx/${review.txHash}`}
                              aria-label='etherscan redirection'
                            >
                              (Etherscan)
                            </Link>
                          </Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                </Flex>
              </Box>
            </Flex>

            <Text mt='10'>{review.content}</Text>
            <VoteOnReview id={review.id} review={review} />
            <Button
              colorScheme={scheme}
              variant='link'
              onClick={onToggle}
              my='4'
              aria-label='comments toggle button'
            >
              {review.comments.length === 0
                ? ''
                : `${review.comments.length} comments`}
            </Button>
            <Collapse in={isOpen} animateOpacity>
              <CommentList on={review} />
            </Collapse>
            <Box>
              {owner !== governance.address ? (
                isOwner ? (
                  <Button
                    onClick={() => banPost(review.id)}
                    isLoading={
                      status.startsWith('Waiting') ||
                      status.startsWith('Pending')
                    }
                    loadingText={status}
                    disabled={
                      status.startsWith('Waiting') ||
                      status.startsWith('Pending')
                    }
                    aria-label='ban button'
                  >
                    Ban
                  </Button>
                ) : (
                  ''
                )
              ) : (
                <>
                  <Button
                    colorScheme='red'
                    variant='outline'
                    onClick={() => voteToBanReview(review.id)}
                    isLoading={
                      status.startsWith('Waiting') ||
                      status.startsWith('Pending')
                    }
                    loadingText={status}
                    disabled={
                      status.startsWith('Waiting') ||
                      status.startsWith('Pending')
                    }
                    aria-label='ban review button'
                  >
                    Vote to ban this review
                  </Button>
                  {banVote ? (
                    <CircularProgress
                      ms='4'
                      value={banVote}
                      max='5'
                      color='red'
                    >
                      <CircularProgressLabel>{banVote}/5</CircularProgressLabel>
                    </CircularProgress>
                  ) : (
                    ''
                  )}
                </>
              )}

              <Text
                mt='4'
                fontSize='sm'
                color='gray.500'
                textAlign='end'
                fontStyle='uppercase'
              >
                Review n°{review.id}{' '}
              </Text>
              <SendComment targetAddress={reviews.address} id={review.id} />
            </Box>
            <Divider my='2' borderColor='gray.500' border='3px' mt='2' />
          </>
        )
      ) : (
        <Skeleton height='200px' />
      )}
    </Box>
  )
}
export default Review
