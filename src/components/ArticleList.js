import {
  Box,
  Flex,
  Link,
  Text,
  Heading,
  Image,
  Grid,
  SlideFade,
  useColorModeValue,
  Divider
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const ArticleList = ({ articleList }) => {
  const border = useColorModeValue("white", "grayBlue.900")
  const hover = useColorModeValue("main", "second")
  const txt = useColorModeValue("grayOrange.800", "grayBlue.200")
  const bgUser = useColorModeValue("white", "grayBlue.900")
  const bgError = useColorModeValue("grayOrange.200", "grayBlue.800")
  const txtError = useColorModeValue("grayOrange.600", "grayBlue.400")
  const bg = useColorModeValue("grayOrange.100", "grayBlue.800")

  return (
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
      <Grid
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)"
        }}
        gap="3"
        bg={bg}
        mb="10"
      >
        {articleList.map((article) => {
          return (
            <Box
              borderRadius="7"
              boxShadow="lg"
              key={article.id}
              p="5"
              _hover={{ border: "2px", borderColor: hover }}
              transition="0.3s"
              bg={article.title ? bgUser : bgError}
              border="2px"
              borderColor={border}
            >
              <Flex justifyContent="space-between">
                <Text
                  as="span"
                  fontSize="xs"
                  textTransform="uppercase"
                  color="gray"
                >
                  Article n°{article.id}
                </Text>
                <Text
                  as="span"
                  fontSize="xs"
                  textTransform="uppercase"
                  color="gray"
                >
                  {article.date}
                </Text>
              </Flex>
              <Heading
                py="2"
                fontSize="2xl"
                _hover={{ color: hover }}
                display="block"
                as={RouterLink}
                to={`/article/${article.id}`}
                isTruncated
                maxW="20ch"
                color={article.title ? txt : txtError}
                textAlign="center"
              >
                {article.title ? article.title : "Data not found..."}
              </Heading>
              <Divider border="1px" />
              <Text
                isTruncated
                maxW="30ch"
                py="6"
                color={article.abstract ? txt : txtError}
              >
                Abstract:{" "}
                {article.abstract
                  ? article.abstract
                  : "IPFS can take sometime to display data"}
              </Text>

              <Flex mb="4" alignItems="center">
                <Image
                  h={10}
                  fit="cover"
                  rounded="full"
                  src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                  alt="Avatar"
                />
                <Link
                  as={RouterLink}
                  to={`/profile/${article.authorID}`}
                  maxW="25ch"
                  isTruncated
                  mx={2}
                  fontWeight="bold"
                  color={txt}
                >
                  {article.firstName} {article.lastName}
                </Link>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>Validity: {article.validityVotes}</Text>
                <Text>Importance: {article.importanceVotes}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>Reviews({article.reviews.length})</Text>
                <Text>Comments({article.comments.length}) </Text>
              </Flex>
            </Box>
          )
        })}
      </Grid>
    </SlideFade>
  )
}

export default ArticleList
