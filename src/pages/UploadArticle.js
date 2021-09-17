import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  useColorModeValue,
  Textarea,
  SlideFade
} from "@chakra-ui/react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { useState } from "react"
import UploadFile from "../components/UploadFile"
import { useArticlesContract } from "../hooks/useArticlesContract"
import { useIPFS } from "../hooks/useIPFS"
import { useUsersContract } from "../hooks/useUsersContract"
import { useCall } from "../web3hook/useCall"

const UploadArticle = () => {
  const { articles } = useArticlesContract()
  const { userData } = useUsersContract()
  const [status, contractCall] = useCall()
  const [pinJsObject, , ipfsStatus, pinFile, unPin] = useIPFS()

  const [abstract, setAbstract] = useState("")
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [coAuthors, setCoAuthors] = useState([])
  const [file, setFile] = useState()

  //Color Mode
  const bg = useColorModeValue("white", "grayBlue.900")

  function addCoAuthor(code, index, input) {
    switch (code) {
      // add co author
      case 0:
        const coAuthor = { address: "", active: true }
        setCoAuthors((a) => [...a, coAuthor])
        break
      // change coAuthor address
      case 1:
        setCoAuthors((a) =>
          a.map((coAuthor, i) => {
            if (index === i) {
              return { ...coAuthor, address: input }
            } else {
              return coAuthor
            }
          })
        )
        // index => address
        break
      default:
        console.log("Wrong code")
        break
    }
  }

  const removeItem = (index) => {
    setCoAuthors((a) => a.filter((coAuthor, i) => index !== i))
  }

  async function publish() {
    const coAuthorArray = coAuthors.map((coAuthor) => {
      return coAuthor.address
    })

    // transform inputs into CID
    let abstractCID = ""
    let contentCID = ""
    if (userData.status === "Approved") {
      let hash = "No PDF joined"
      if (file !== undefined) {
        hash = await pinFile(file)
      }
      const body = { version: 0.1, content, pdfFile: hash }
      contentCID = await pinJsObject(body)
      const header = { version: 0.1, title, abstract, content: contentCID }
      abstractCID = await pinJsObject(header)
    }

    // push CID to the blockchain
    const tx = await contractCall(articles, "publish", [
      coAuthorArray,
      abstractCID,
      contentCID
    ])

    // unpin content if revert
    if (userData.status === "Approved") {
      if (tx === "Error") {
        await unPin(abstractCID)
        await unPin(contentCID)
      }
    }

    // reset inputs
    setAbstract("")
    setCoAuthors([])
    setContent("")
    setTitle("")
    setFile()
  }

  const scheme = useColorModeValue("colorMain", "colorSecond")

  return (
    <>
      <Box p="10">
        <Container
          shadow="lg"
          maxW="container.lg"
          bg={bg}
          p="10"
          borderRadius="50"
        >
          <SlideFade
            threshold="0.1"
            delay={{ enter: 0.1 }}
            transition={{
              enter: { duration: 0.7 }
            }}
            offsetY="0px"
            offsetX="100px"
            in
          >
            <Heading textAlign="center" mb="2">
              Publish an article
            </Heading>
          </SlideFade>

          <Box display="flex" flexDirection="column" mx="auto" maxW="75%">
            <SlideFade
              threshold="0.1"
              delay={{ enter: 0.1 }}
              transition={{
                enter: { duration: 0.7 }
              }}
              offsetY="-100px"
              offsetX="0px"
              in
            >
              {/* CO AUTHOR */}
              <Heading fontSize="3xl" as="h3">
                Header
              </Heading>

              <FormControl mb="4">
                <FormLabel>Co-Authors</FormLabel>
                {coAuthors.map((coAuthor, index) => {
                  return (
                    <Flex key={index} mb="4">
                      {coAuthor.active ? (
                        <>
                          <Input
                            value={coAuthor.address}
                            onChange={(e) =>
                              addCoAuthor(1, index, e.target.value)
                            }
                            placeholder="0x000000000000"
                            borderEndRadius="0"
                          />

                          <Button
                            borderStartRadius="0"
                            onClick={() => removeItem(index)}
                            colorScheme="red"
                            aria-label="toggle button for delete coAuthors"
                          >
                            <MinusIcon />
                          </Button>
                        </>
                      ) : (
                        ""
                      )}
                    </Flex>
                  )
                })}
                <Button
                  onClick={() => addCoAuthor(0)}
                  colorScheme={scheme}
                  aria-label="toggle button for add coAuthors"
                >
                  <AddIcon />
                </Button>
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Science and co."
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Abstract</FormLabel>
                <Textarea
                  value={abstract}
                  placeholder="Resume the article..."
                  onChange={(e) => setAbstract(e.target.value)}
                />
              </FormControl>
            </SlideFade>

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
              <Heading fontSize="3xl" as="h3">
                Content
              </Heading>
              <FormControl mb="4">
                <FormLabel>Introduction</FormLabel>
                <Textarea
                  value={content}
                  minH="40"
                  placeholder="Content of your article..."
                  onChange={(e) => setContent(e.target.value)}
                />
              </FormControl>
              <UploadFile file={file} setFile={setFile} />
            </SlideFade>

            <SlideFade
              threshold="0.1"
              delay={{ enter: 0.25 }}
              transition={{
                enter: { duration: 0.8 }
              }}
              offsetY="0px"
              offsetX="-200px"
              in
            >
              <Button
                isLoading={
                  status.startsWith("Waiting") ||
                  status.startsWith("Pending") ||
                  ipfsStatus.startsWith("Pinning")
                }
                loadingText={
                  ipfsStatus.startsWith("Pinning") ? ipfsStatus : status
                }
                disabled={
                  !title.length ||
                  !abstract.length ||
                  !content.length ||
                  status.startsWith("Waiting") ||
                  status.startsWith("Pending") ||
                  ipfsStatus.startsWith("Pinning")
                }
                onClick={publish}
                colorScheme={scheme}
                aria-label="submit button"
              >
                Submit
              </Button>
            </SlideFade>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default UploadArticle
