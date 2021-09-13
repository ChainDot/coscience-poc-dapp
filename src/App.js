import './App.css'
import Dapp from './Dapp'
import UsersContextProvider from './contexts/UsersContext.js'
import ArticlesContextProvider from './contexts/ArticlesContext'
import ReviewsContextProvider from './contexts/ReviewsContext'
import CommentsContextProvider from './contexts/CommentsContext'
import GovernanceContextProvider from './contexts/GovernanceContext'
import { useWeb3 } from './web3hook/useWeb3'

const App = () => {
  const { state } = useWeb3()
  return (
    <>
      <GovernanceContextProvider>
        <UsersContextProvider>
          <ArticlesContextProvider>
            <ReviewsContextProvider>
              <CommentsContextProvider>
                {state.ethersProvider !== null ? <Dapp /> : 'No provider'}
              </CommentsContextProvider>
            </ReviewsContextProvider>
          </ArticlesContextProvider>
        </UsersContextProvider>
      </GovernanceContextProvider>
    </>
  )
}

export default App
