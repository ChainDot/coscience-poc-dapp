import { InfoIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Button,
  Collapse,
  Popover,
  PopoverArrow,
  PopoverBody,
  useDisclosure,
  PopoverCloseButton,
  PopoverContent,
  Divider,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useCommentsContract } from '../hooks/useCommentsContract'
import CommentList from './CommentList'
import SendComment from './SendComment'
import VoteOnComment from './VoteOnComment'

const Comment = ({ comment }) => {
  const { comments } = useCommentsContract()

  const link = useColorModeValue('main', 'second')

  const { isOpen, onToggle } = useDisclosure()
  const scheme = useColorModeValue('colorMain', 'colorSecond')

  return (
    <Box mb='5' p='5' key={comment.id}>
      {comment !== undefined ? (
        <>
          <Divider my='2' borderColor='gray.500' border='3px' mt='2' />

          <Flex
            flexDirection={{ base: 'column', lg: 'row' }}
            justifyContent={{ base: 'start', lg: 'space-between' }}
          >
            <Box>
              <Heading as='h2' fontSize='3xl'>
                Comment #{comment.id}
              </Heading>

              <Text>
                by{' '}
                <Link
                  as={RouterLink}
                  color={link}
                  to={`/profile/${comment.authorID}`}
                >
                  {comment.firstName} {comment.lastName}
                </Link>{' '}
                | {comment.date} | {comment.comments.length} comments
              </Text>
            </Box>

            <Box textAlign={{ base: 'start', lg: 'end' }}>
              <Flex alignItems='center'>
                <Text>Blockchain Informations</Text>
                <Box>
                  <Popover placement='top-start'>
                    <PopoverTrigger>
                      <IconButton
                        variant='Link'
                        color={link}
                        icon={<InfoIcon />}
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
                          Address of author: {comment.author}{' '}
                          <Link
                            color={link}
                            isExternal
                            href={`https://rinkeby.etherscan.io/address/${comment.author}`}
                          >
                            (Etherscan)
                          </Link>{' '}
                        </Text>
                        <Text>
                          Mined in block n° {comment.blockNumber}{' '}
                          <Link
                            color={link}
                            isExternal
                            href={`https://rinkeby.etherscan.io/txs?block=${comment.blockNumber}`}
                          >
                            (Etherscan)
                          </Link>{' '}
                        </Text>

                        <Text>
                          Transaction hash: {comment.txHash}{' '}
                          <Link
                            color={link}
                            isExternal
                            href={`https://rinkeby.etherscan.io/tx/${comment.txHash}`}
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

          <Text mt='10'>{comment.content}</Text>

          <VoteOnComment id={comment.id} comment={comment} />

          <Button colorScheme={scheme} variant='link' onClick={onToggle} mt='4'>
            {comment.comments.length === 0
              ? ''
              : `${comment.comments.length} comments`}
          </Button>
          <Collapse in={isOpen} animateOpacity>
            <CommentList on={comment} />
          </Collapse>
          <SendComment targetAddress={comments.address} id={comment.id} />
          <Text
            mt='4'
            fontSize='sm'
            color='gray.500'
            textAlign='end'
            fontStyle='uppercase'
          >
            Comment n°{comment.id}{' '}
          </Text>
          <Divider my='2' borderColor='gray.500' border='3px' mt='2' />
        </>
      ) : (
        <Skeleton height='200px' />
      )}
    </Box>
  )
}
export default Comment
