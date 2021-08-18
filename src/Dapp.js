import { Switch, Route } from "react-router-dom"
import { Flex, useColorModeValue } from "@chakra-ui/react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Terms from "./components/Terms"
import Privacy from "./components/Privacy"
import ListOfUsers from "./components/ListOfUsers"

import SignUp from "./pages/SignUp"
import About from "./pages/About"
import Profile from "./pages/Profile"
import UploadArticle from "./pages/UploadArticle"
import RecoverAccount from "./components/RecoverAccount"
import Home from "./pages/Home"

const Dapp = () => {
  // color Mode
  const bg = useColorModeValue("gray.200", "gray.500")

  return (
    <>
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
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/terms">
            <Terms />
          </Route>
          <Route exact path="/privacy">
            <Privacy />
          </Route>
        </Switch>
        <Footer />
      </Flex>
    </>
  )
}

export default Dapp
