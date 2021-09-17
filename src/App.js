import "./App.css"
import Dapp from "./Dapp"
import UsersContextProvider from "./contexts/UsersContext.js"
import ArticlesContextProvider from "./contexts/ArticlesContext"
import ReviewsContextProvider from "./contexts/ReviewsContext"
import CommentsContextProvider from "./contexts/CommentsContext"
import GovernanceContextProvider from "./contexts/GovernanceContext"
import { useWeb3 } from "./web3hook/useWeb3"
import { Image } from "@chakra-ui/image"
import { Box, Text } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/button"

const App = () => {
  const { state } = useWeb3()
  return (
    <>
      <GovernanceContextProvider>
        <UsersContextProvider>
          <ArticlesContextProvider>
            <ReviewsContextProvider>
              <CommentsContextProvider>
                {state.ethersProvider !== null ? (
                  <Dapp />
                ) : (
                  <Box flexDirection="column" display="flex" m="auto">
                    <Image
                      mx="auto"
                      w="500px"
                      h="500px"
                      animation="rotation 2s"
                      transform="rotate(360deg)"
                      src="https://ipfs.io/ipfs/QmXRXx7tgHgFoaceDZZfpcoKMMkwWcsmLr5MSveGgiFEZx"
                    />{" "}
                    <Text textAlign="center" fontSize="8xl">
                      Fetching a provider...
                    </Text>{" "}
                    <Button
                      colorScheme="facebook"
                      onClick={() => window.location.reload()}
                    >
                      Reload the page if it's too long
                    </Button>
                  </Box>
                )}
              </CommentsContextProvider>
            </ReviewsContextProvider>
          </ArticlesContextProvider>
        </UsersContextProvider>
      </GovernanceContextProvider>
    </>
  )
}

export default App
