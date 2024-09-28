import { useState, useEffect, useRef } from 'react'
import { ThemeProvider } from './components/theme-provider'
import Header from './components/Header'
import VideoPlayer from './components/VideoPlayer'
import { Chat } from './components/Chat'
import { RecommendationsScroll } from './components/RecommendationsScroll'
import { Separator } from './components/ui/separator'
import { channel } from 'diagnostics_channel'
// import { fetchVideoData, fetchChatMessages, fetchRecommendations } from './api/streamingApi'
// import { subscribeToLiveChat } from './brokers/chatBroker'

function App() {
  // const [videoData, setVideoData] = useState(null)
  // const [chatMessages, setChatMessages] = useState([])
  // const [recommendations, setRecommendations] = useState([])
  const [videoData] = useState({
    id: '1',
    title: 'Sample Video',
    thumbnailUrl: 'https://via.placeholder.com/640x360',
  })
  const [chatMessages] = useState([
  ])
  const [recommendations] = useState([
    { id: '1', title: 'Recommended Video 1', channel: 'Channel 1', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '2', title: 'Recommended Video 2', channel: 'Channel 2', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '3', title: 'Recommended Video 3', channel: 'Channel 3', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '4', title: 'Recommended Video 4', channel: 'Channel 4', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '5', title: 'Recommended Video 5', channel: 'Channel 5', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '6', title: 'Recommended Video 6', channel: 'Channel 6', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '7', title: 'Recommended Video 7', channel: 'Channel 7', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '8', title: 'Recommended Video 8', channel: 'Channel 8', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '9', title: 'Recommended Video 9', channel: 'Channel 9', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '10', title: 'Recommended Video 10', channel: 'Channel 10', thumbnailUrl: 'https://via.placeholder.com/320x180' },
  ])

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
      <div className="min-h-screen bg-background text-foreground w-full">
        <Header />
        <main className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-4/5 ">
              {videoData && <VideoPlayer video={videoData} />}
            </div>
            <div className="lg:w-1/5 flex flex-col"> 
              <Chat messages={chatMessages} />
            </div>
          </div>
        </main>
        <RecommendationsScroll items={recommendations}/>
      </div>
    </ThemeProvider>
  )
}

export default App
