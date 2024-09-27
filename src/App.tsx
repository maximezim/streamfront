import { useState, useEffect, useRef } from 'react'
import { ThemeProvider } from './components/theme-provider'
import Header from './components/Header'
import VideoPlayer from './components/VideoPlayer'
import { Chat } from './components/Chat'
import { RecommendationsDrawer } from './components/RecommendationsDrawer'
// import { fetchVideoData, fetchChatMessages, fetchRecommendations } from './api/streamingApi'
// import { subscribeToLiveChat } from './brokers/chatBroker'

function App() {
  // const [videoData, setVideoData] = useState(null)
  // const [chatMessages, setChatMessages] = useState([])
  // const [recommendations, setRecommendations] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const lastScrollY = useRef(0)
  const [videoData] = useState({
    id: '1',
    title: 'Sample Video',
    thumbnailUrl: 'https://via.placeholder.com/640x360',
  })
  const [chatMessages] = useState([
  ])
  const [recommendations] = useState([
    { id: '1', title: 'Recommended Video 1', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: '2', title: 'Recommended Video 2', thumbnailUrl: 'https://via.placeholder.com/320x180' },
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setIsDrawerOpen(true)
      } else if (currentScrollY < lastScrollY.current) {
        setIsDrawerOpen(false)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
        <RecommendationsDrawer items={recommendations} isOpen={isDrawerOpen} />
      </div>
    </ThemeProvider>
  )
}

export default App
