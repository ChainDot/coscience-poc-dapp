import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { Web3Provider } from "web3-hooks"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { BrowserRouter as Router } from "react-router-dom"
import { styles } from "./theme/index"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ChakraProvider theme={extendTheme(styles)}>
        <Web3Provider>
          <App />
        </Web3Provider>
      </ChakraProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
