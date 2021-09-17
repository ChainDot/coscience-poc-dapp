import {
  Box,
  Text,
  Heading,
  AccordionItem,
  Accordion as ChakraAccordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Flex,
  useColorModeValue
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useArticlesContract } from '../hooks/useArticlesContract'
import { useReviewsContract } from '../hooks/useReviewsContract'
import { useEffect, useState } from 'react'
import { useCommentsContract } from '../hooks/useCommentsContract'

const Accordion = ({ object, type }) => {
  const { reviews } = useReviewsContract()
  const { articles } = useArticlesContract()
  const { comments } = useCommentsContract()

  const [articleID, setArticleID] = useState()

  //                  Color Value
  const scheme = useColorModeValue('colorMain', 'colorSecond')

  useEffect(() => {
    ;(async () => {
      switch (type) {
        case 'Article':
          setArticleID(object.id)
          break
        case 'Review':
          setArticleID(object.targetID)
          break
        case 'Comment':
          // comment
          // CRAWLER ------------------------------------
          let on = object
          while (on.target === comments.address) {
            const onComment = await comments.commentInfo(on.targetID)
            on = onComment
          }
          if (on.target === articles.address) {
            let number
            if (typeof on.id !== 'number') {
              number = on.id.toNumber()
            } else {
              number = on.id
            }
            setArticleID(number)
          } else if (on.target === reviews.address) {
            let number
            if (typeof on.id !== 'number') {
              number = on.id.toNumber()
            } else {
              number = on.id
            }
            setArticleID(number)
          }
          break
        default:
          console.log(`Wrong type in Accordion ${type}`)
      }
    })()
  }, [
    object.id,
    object.targetID,
    type,
    articles.address,
    reviews.address,
    comments,
    object
  ])

  return (
    <ChakraAccordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex='1' textAlign='left'>
            {type} n°{object.id} : {type === 'Comment' ? '' : object.title}
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          <Box>
            <Heading>
              {type === 'Comment' ? `Comment n°${object.id}` : object.title}
            </Heading>
            {type === 'Article' ? (
              <>
                {object.coAuthor.length ? (
                  <>
                    <Text>Co-authors: </Text>{' '}
                    {object.coAuthor.map((author, index) => {
                      return (
                        <Text key={author}>{`${index + 1}: ${author}`}</Text>
                      )
                    })}
                  </>
                ) : (
                  'There is no co-author'
                )}
                <Text mt='6' textAlign='center' fontSize='md'>
                  Abstract
                </Text>
                <Text mb='6' textAlign='center'>
                  {object.abstract}
                </Text>
                <Flex alignItems='center' justifyContent='space-between'>
                  <Button
                    as={Link}
                    to={`/article/${object.id}`}
                    colorScheme={scheme}
                    aria-label='read the article button'
                  >
                    Read the article
                  </Button>
                  <Box>
                    <Text textAlign='end' fontSize='md'>
                      Nb of reviews: {object.reviews.length}{' '}
                    </Text>
                    <Text textAlign='end' fontSize='md'>
                      Nb of comments: {object.comments.length}{' '}
                    </Text>
                  </Box>
                </Flex>
              </>
            ) : type === 'Review' ? (
              <>
                <Text mt='6' fontSize='md'>
                  Content
                </Text>
                <Text>{object.content}</Text>
                <Button
                  colorScheme={scheme}
                  as={Link}
                  to={`/article/${object.targetID}`}
                  aria-label='article redirection button'
                >
                  On article n°{object.targetID}
                </Button>
              </>
            ) : (
              <>
                <Text mt='6' fontSize='md'>
                  Content
                </Text>
                <Text>{object.content}</Text>
                <Button
                  to={`/article/${articleID}`}
                  colorScheme={scheme}
                  as={Link}
                  aria-label='article redirection button'
                >
                  {' '}
                  On article n°{articleID}
                </Button>
              </>
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </ChakraAccordion>
  )
}

export default Accordion
