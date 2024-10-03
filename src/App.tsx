import { useState, useEffect, useRef } from 'react'
import { ThemeProvider } from './components/theme-provider'
import Header from './components/Header'
import VideoPlayer from './components/VideoPlayer'
import { Streams } from './components/Streams'
import { Chat } from './components/Chat'
import { RecommendationsScroll } from './components/RecommendationsScroll'
import { HiServerStack,HiMiniUsers  } from "react-icons/hi2";
import { IoGitNetworkOutline } from "react-icons/io5";
import { CiStreamOn } from "react-icons/ci";
import { Separator } from './components/ui/separator'

// import { fetchVideoData, fetchChatMessages, fetchRecommendations } from './api/streamingApi'
// import { subscribeToLiveChat } from './brokers/chatBroker'

function App() {
  // const [videoData, setVideoData] = useState(null)
  // const [chatMessages, setChatMessages] = useState([])
  // const [recommendations, setRecommendations] = useState([])
  const [username, setUsername] = useState('')

  const handleLogin = (username: string) => {
    setUsername(username)
  }

  const [videoData] = useState({
    id: '1',
    title: 'Sample Video',
    thumbnailUrl: 'https://via.placeholder.com/640x360',
  })
  const [chatMessages] = useState([
  ])
  const [streams] = useState([
    { id: '1', title: 'Stream 1', channel: 'Channel 1', thumbnailUrl: 'https://via.placeholder.com/640x360' },
    { id: '2', title: 'Stream 2', channel: 'Channel 2', thumbnailUrl: 'https://via.placeholder.com/640x360' },
    { id: '3', title: 'Stream 3', channel: 'Channel 3', thumbnailUrl: 'https://via.placeholder.com/640x360' },
    { id: '4', title: 'Stream 4', channel: 'Channel 4', thumbnailUrl: 'https://via.placeholder.com/640x360' },
    { id: '5', title: 'Stream 5', channel: 'Channel 5', thumbnailUrl: 'https://via.placeholder.com/640x360' },
    { id: '6', title: 'Stream 6', channel: 'Channel 6', thumbnailUrl: 'https://via.placeholder.com/640x360' },
    { id: '7', title: 'Stream 7', channel: 'Channel 7', thumbnailUrl: 'https://via.placeholder.com/640x360' },
    { id: '8', title: 'Stream 8', channel: 'Channel 8', thumbnailUrl: 'https://via.placeholder.com/640x360' },
    { id: '9', title: 'Stream 9', channel: 'Channel 9', thumbnailUrl: 'https://via.placeholder.com/640x360' },

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

  const [page, setPage] = useState("stream");

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


  function affichagePage() {
    switch (page) {
      case "home":
        return (
          <main className="container mx-auto p-4 mb-6">
            <h1 className="text-4xl font-bold mb-4">Home</h1>
            <p className="text-lg mb-6">
              Welcome to the home page. This is where you can browse and watch videos.
            </p>
            <Separator className='mb-9' />
            <Streams items={streams} />
          </main>
        )
      case "stream":
        return (
          <><main className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-4/5 ">
                {videoData && <VideoPlayer video={videoData} />}
              </div>
              <div className="lg:w-1/5 flex flex-col">
                <Chat messages={chatMessages} username={username}/>
              </div>
            </div>
          </main><RecommendationsScroll items={recommendations} /></>
        )
      case "dashboard":
        return (
          <main className="container mx-auto p-4 h-full">
            <div className="flex flex-col lg:flex-row gap-6 mb-6 mt-6">
              <div className='lg:w-1/4 bg-slate-50 h-32 rounded-md flex items-center justify-between p-8 gap-6'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm italic text-slate-400'>Number of nodes</p>
                  <p className='text-3xl font-semibold'>5</p>
                </div>
                <HiServerStack size={50} />
              </div>
              <div className='lg:w-1/4 bg-slate-50 h-32 rounded-md flex items-center justify-between p-8 gap-6'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm italic text-slate-400'>Number of edges</p>
                  <p className='text-3xl font-semibold'>17</p>
                </div>
                <IoGitNetworkOutline size={50} />
              </div>
              <div className='lg:w-1/4 bg-slate-50 h-32 rounded-md flex items-center justify-between p-8 gap-6'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm italic text-slate-400'>Number of users</p>
                  <p className='text-3xl font-semibold'>4.450</p>
                </div>
                <HiMiniUsers size={50} />
              </div>
              <div className='lg:w-1/4 bg-slate-50 h-32 rounded-md flex items-center justify-between p-8 gap-6'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm italic text-slate-400'>Number of streams</p>
                  <p className='text-3xl font-semibold'>140</p>
                </div>
                <CiStreamOn size={50} />
              </div>
            </div>
            <div className='w-full h-96 bg-slate-50 rounded-md'>

            </div>
          </main>
        )
    }
  }

  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <div className="min-h-screen bg-background text-foreground w-full">
        <Header setPage={setPage} onLogin={handleLogin} />
        {affichagePage()}
      </div>
    </ThemeProvider>
  )
}

export default App
