import { Switch, Route } from "react-router-dom"
import { Flex, useColorModeValue } from "@chakra-ui/react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ListOfUsers from "./pages/ListOfUsers"

import SignUp from "./pages/SignUp"
import About from "./pages/About"
import Profile from "./pages/Profile"
import UploadArticle from "./pages/UploadArticle"
import RecoverAccount from "./pages/RecoverAccount"
import Home from "./pages/Home"
import Article from "./pages/Article"
import ConfigModal from "./components/ConfigModal"

const Dapp = () => {
  // color Mode
  const bg = useColorModeValue("gray.200", "gray.500")

  return (
    <>
      <ConfigModal />
      <Flex minH="100vh" direction="column" alignItems="space-around" bg={bg}>
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/sign-up">
            <SignUp />
          </Route>
          <Route exact path="/recover">
            <RecoverAccount />
          </Route>
          <Route exact path="/upload-article">
            <UploadArticle />
          </Route>
          <Route exact path="/list-of-users">
            <ListOfUsers />
          </Route>
          <Route exact path="/profile/:id">
            <Profile />
          </Route>
          <Route exact path="/article/:id">
            <Article />
          </Route>
        </Switch>
        <Footer />
      </Flex>
    </>
  )
}

export default Dapp
