import { useContext } from "react"
import { ArticlesContext } from "../contexts/ArticlesContext"

// Pure function
export const getArticleData = async (articles, id) => {
  const a = await articles.articleInfo(id)

  const articleObj = {
    id: a.id.toNumber(),
    author: a.author,
    coAuthor: a.coAuthor,
    validity: a.validity.toNumber(),
    importance: a.importance.toNumber(),
    contentBanned: a.contentBanned,
    abstractCID: a.abstractCID,
    contentCID: a.contentCID,
    comments: a.comments,
    reviews: a.reviews
  }
  return articleObj
}

// return articleList of user
const createArticleList = async (articles, listOfId) => {
  const articleList = []

  for (const id of listOfId) {
    const articleObj = await getArticleData(articles, id)
    articleList.push(articleObj)
  }

  return articleList
}

// -----------------------------------------------------HOOK
export const useArticlesContract = () => {
  // call the context with global state
  const [articles, , articleList, articleEvents] = useContext(ArticlesContext)

  // filter events
  /*
              // filter all farahtoken transfers FROM the account
          let txOut = await farahtoken.filters.Transfer(web3State.account, null)
          // filter all farahtoken transfers TO the account
          let txIn = await farahtoken.filters.Transfer(null, web3State.account)
          // list all Transfer event from me
          txOut = await farahtoken.queryFilter(
            txOut , {block range or last number }
            )
            // list all Transfer event to me
            txIn = await farahtoken.queryFilter(txIn)
            */

  // control call of the hook
  if (articles === undefined) {
    throw new Error(
      `It seems that you are trying to use ArticlesContext outside of its provider`
    )
  }

  // first: return contract for utilisation
  return {
    articles,
    articleList,
    getArticleData,
    createArticleList,
    articleEvents
  }
}
