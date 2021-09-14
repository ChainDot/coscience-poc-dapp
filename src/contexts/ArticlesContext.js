import { createContext, useEffect, useState } from "react"
import { useContract } from "../web3hook/useContract"
import { contractAddress, contractABI } from "../contracts/articles"
import { useWeb3 } from "../web3hook/useWeb3"
import { getArticleData } from "../hooks/useArticlesContract"

export const ArticlesContext = createContext(null)

const ArticlesContextProvider = ({ children }) => {
  const [{ contract, mode }] = useContract(contractAddress, contractABI)
  const { state } = useWeb3()
  const { networkName } = state

  // utils
  const [articleList, setArticleList] = useState([])
  const [articleEvents, setArticleEvents] = useState()

  // create list of article
  // has been deplaced here to create only one list of article for the entire App
  useEffect(() => {
    const createArticleList = async () => {
      const nb = await contract.totalSupply()
      const articlesList = []

      // in waiting for the articleID indexed
      const eventList = [
        { articleID: 0, txHash: null, timestamp: 0, blockNumber: 0 }
      ]
      const eventArray = await contract.queryFilter("Published") // EthersJS / Contract
      for (const event of eventArray) {
        const block = await event.getBlock()
        const date = new Date(block.timestamp * 1000)
        const obj = {
          articleID: event.args.articleID.toNumber(),
          txHash: event.transactionHash,
          timestamp: block.timestamp,
          blockNumber: event.blockNumber,
          date: date.toLocaleString()
        }
        eventList.push(obj)
        // [{null},{event1 = articleID: 1}]
      }
      setArticleEvents(eventList)

      for (let i = 1; i <= nb; i++) {
        const obj = await getArticleData(contract, i) // i = id

        const validity = obj.validity
        const importance = obj.importance
        const { txHash, timestamp, blockNumber, date } = eventList[i]

        // Importance
        let nbOfImportanceVote = await contract.filters.ImportanceVoted(
          null,
          Number(i), // need to hexify the number 1 = 0x01
          null
        )

        let eventArray = await contract.queryFilter(nbOfImportanceVote)
        const importanceVotes = eventArray.length

        // Validity
        let nbOfValidityVote = await contract.filters.ValidityVoted(
          null,
          Number(i), // need to hexify the number
          null
        )
        eventArray = await contract.queryFilter(nbOfValidityVote)
        const validityVotes = eventArray.length

        articlesList.push({
          ...obj,
          txHash,
          timestamp,
          blockNumber,
          date,
          validity,
          importance,
          importanceVotes,
          validityVotes
        })
      }
      console.log("List of articles created")
      setArticleList(articlesList)
    }
    if (contract && networkName === "rinkeby") {
      createArticleList()
      contract.on("Published", createArticleList)
    }

    return () => {
      setArticleList(undefined)
      contract?.off("Published", createArticleList)
    }
  }, [contract, networkName])

  return (
    <ArticlesContext.Provider
      value={[contract, mode, articleList, articleEvents]}
    >
      {children}
    </ArticlesContext.Provider>
  )
}

export default ArticlesContextProvider
