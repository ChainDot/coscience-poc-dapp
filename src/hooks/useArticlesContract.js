import { useContext, useEffect, useState } from "react"
import { ArticlesContext } from "../contexts/ArticlesContext"

// Pure function
const getArticleData = async (articles, id) => {
  const a = await articles.articleInfo(id)

  const articleObj = {
    id: a.id.toNumber(),
    author: a.author,
    coAuthor: a.coAuthor,
    contentBanned: a.contentBanned,
    abstractCID: a.abstractCID,
    contentCID: a.contentCID,
    comments: a.comments,
    reviews: a.reviews,
  }
  return articleObj
}

// return articleList of user
const userArticleList = async (articles, listOfId) => {
  const articleList = []

  for (const id of listOfId) {
    const articleObj = await getArticleData(articles, id)
    articleList.push(articleObj)
  }

  return articleList
}

// -----------------------------------------------------HOOK
export const useArticlesContract = () => {
  // call the context
  const [articles] = useContext(ArticlesContext)

  // utils
  const [articleList, setArticleList] = useState([])
  const [articleEvents, setArticleEvents] = useState()

  // create list of article
  useEffect(() => {
    if (articles) {
      const createArticleList = async () => {
        const nb = await articles.nbOfArticles()
        const articlesList = []

        // in waiting for the articleID indexed
        const eventList = [
          { articleID: 0, txHash: null, timestamp: 0, blockNumber: 0 },
        ]
        const eventArray = await articles.queryFilter("Published") // EthersJS / Contract
        for (const event of eventArray) {
          const block = await event.getBlock()
          const date = new Date(block.timestamp * 1000)
          const obj = {
            articleID: event.args.articleID.toNumber(),
            txHash: event.transactionHash,
            timestamp: block.timestamp,
            blockNumber: event.blockNumber,
            date: date.toLocaleString(),
          }
          eventList.push(obj)
          // [{null},{event1 = articleID: 1}]
        }
        setArticleEvents(eventList)

        for (let i = 1; i <= nb; i++) {
          const obj = await getArticleData(articles, i) // i = id
          const { txHash, timestamp, blockNumber, date } = eventList[i]

          articlesList.push({
            ...obj,
            txHash,
            timestamp,
            blockNumber,
            date,
          })
        }
        setArticleList(articlesList)
      }
      createArticleList()
    }

    return () => setArticleList(undefined)
  }, [articles])

  // control call of the hook
  if (articles === undefined) {
    throw new Error(
      `It seems that you are trying to use ArticlesContext outside of its provider`
    )
  }

  // first: return contract for utilisation
  return [articles, articleList, getArticleData, userArticleList, articleEvents]
}
