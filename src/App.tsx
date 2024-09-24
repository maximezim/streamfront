import { useState, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import Header from './components/Header'
import VideoPlayer from './components/VideoPlayer'
import { Chat } from './components/Chat'
import { Recommendations } from './components/Recommendations'
// import { fetchVideoData, fetchChatMessages, fetchRecommendations } from './api/streamingApi'
// import { subscribeToLiveChat } from './brokers/chatBroker'

function App() {
  const [videoData, setVideoData] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const loadInitialData = async () => {
      // const video = await fetchVideoData()
      // setVideoData(video)

      // const messages = await fetchChatMessages(video.id)
      // setChatMessages(messages)

      // const recs = await fetchRecommendations(video.id)
      // setRecommendations(recs)

      // Subscribe to live chat updates
      // subscribeToLiveChat(video.id, (newMessage) => {
      //   setChatMessages((prevMessages) => [...prevMessages, newMessage])
      // })
    }

    loadInitialData()
  }, [])

  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3">
              {videoData && <VideoPlayer video={videoData} />}
            </div>
            <div className="lg:w-1/3">
              <Chat messages={chatMessages} />
            </div>
          </div>
          <div className="mt-8">
            <Recommendations items={recommendations} />
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
