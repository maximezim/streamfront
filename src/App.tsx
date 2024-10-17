import { useState, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import Header from './components/Header'
import VideoPlayer from './components/VideoPlayer'
import { Streams } from './components/Streams'
import { Chat } from './components/Chat'
import { RecommendationsScroll } from './components/RecommendationsScroll'
import { Dashboard } from './components/Dashboard'
import { Separator } from './components/ui/separator'
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { motion, AnimatePresence } from 'framer-motion'
import { brokerService } from './brokerService';
import { VideoProvider } from './VideoContext';

function App() {
  const [username, setUsername] = useState('')
  const [page, setPage] = useState("home");
  const [streamId, setStreamId] = useState(1);

  const toStream = (id: number) => {
    setStreamId(id)
    setPage("stream")
  }

  const handleLogin = (username: string) => {
    setUsername(username)
  }


  const [chatMessages] = useState([])
  const [streams] = useState([
    { id: 1, title: 'Recommended Video 1', channel: 'Channel 1', thumbnailUrl: 'https://cdn-0001.qstv.on.epicgames.com/FnWjYxEYtXzOlTXnBz/image/landscape_comp_m.jpeg' },
    { id: 2, title: 'Recommended Video 2', channel: 'Channel 2', thumbnailUrl: 'https://cdn-0001.qstv.on.epicgames.com/XgQiSOKbxIsYKsmlYl/image/landscape_comp_m.jpeg' },
    { id: 3, title: 'Recommended Video 3', channel: 'Channel 3', thumbnailUrl: 'https://pm1.aminoapps.com/6794/0b9f15f150664d0779c583c9a9c1d9d3c7a18129v2_hq.jpg' },
    { id: 4, title: 'Recommended Video 4', channel: 'Channel 4', thumbnailUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/09b6422f-9135-4f69-ba8a-f79845fd759f/dcd7lpb-bc33d43c-77eb-47ed-bba6-0df35838b973.jpg/v1/fill/w_1024,h_571,q_75,strp/roblox__joshplaysroblox_live_stream__thumbnail__by_pixelatedquota_dcd7lpb-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTcxIiwicGF0aCI6IlwvZlwvMDliNjQyMmYtOTEzNS00ZjY5LWJhOGEtZjc5ODQ1ZmQ3NTlmXC9kY2Q3bHBiLWJjMzNkNDNjLTc3ZWItNDdlZC1iYmE2LTBkZjM1ODM4Yjk3My5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.7WUvhl1yra8ji4oPq4XQ7M6eKICQRPDwm8ypj0yj4og' },
    { id: 5, title: 'Recommended Video 5', channel: 'Channel 5', thumbnailUrl: 'https://i.pinimg.com/736x/bb/ce/d3/bbced3e43f35b7a036ede45e39cb8b4c.jpg' },
    { id: 6, title: 'Recommended Video 6', channel: 'Channel 6', thumbnailUrl: 'https://pbs.twimg.com/media/EcIbjlJWkAQILHo.jpg:large' },
    { id: 7, title: 'Recommended Video 7', channel: 'Channel 7', thumbnailUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1926680/ss_5e1af78cb3675067fc7b0662656e4423d1657712.600x338.jpg?t=1724240226' },
  ])

  const [recommendations] = useState([
    { id: 1, title: 'Recommended Video 1', channel: 'Channel 1', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 2, title: 'Recommended Video 2', channel: 'Channel 2', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 3, title: 'Recommended Video 3', channel: 'Channel 3', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 4, title: 'Recommended Video 4', channel: 'Channel 4', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 5, title: 'Recommended Video 5', channel: 'Channel 5', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 6, title: 'Recommended Video 6', channel: 'Channel 6', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 7, title: 'Recommended Video 7', channel: 'Channel 7', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 8, title: 'Recommended Video 8', channel: 'Channel 8', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 9, title: 'Recommended Video 9', channel: 'Channel 9', thumbnailUrl: 'https://via.placeholder.com/320x180' },
    { id: 10, title: 'Recommended Video 10', channel: 'Channel 10', thumbnailUrl: 'https://via.placeholder.com/320x180' },
  ])

  useEffect(() => {
    const loadInitialData = async () => {
      brokerService();
    }

    loadInitialData()
  }, [])

  function affichagePage() {
    switch (page) {
      case "home":
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <main className="container mx-auto p-4 mb-6">
              <AnimatePresence mode='wait'>
                <motion.div
                  key="home-title"
                  initial={{ translateY: 20, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 50,
                  }}
                >
                  <h1 className="text-4xl font-bold mb-4">Home</h1>
                </motion.div>
                <motion.div
                  key="home-description"
                  initial={{ translateY: 20, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 50,
                    delay: 0.1
                  }}
                >
                  <p className="text-lg mb-6">
                    Welcome to the home page. This is where you can browse and watch videos.
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className='relative z-10'>
                <Separator className='mb-9' />
                <Streams items={streams} toStream={toStream} />
                <DotPattern
                  className={cn(
                    "[mask-image:radial-gradient(circle_at_center,white,transparent)]", "h-full pt-3"
                  )}
                />
              </div>
            </main>
          </motion.div>
        )
      case "stream":
        return (
          <motion.div
            key="stream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <main className="container mx-auto p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-4/5 ">
                  {<VideoPlayer />}
                </div>
                <div className="lg:w-1/5 flex flex-col relative z-10">
                  <Chat messages={chatMessages} username={username}/>
                </div>
              </div>
            </main>
            <RecommendationsScroll items={recommendations} />
            <DotPattern
                className={cn(
                  "[mask-image:radial-gradient(circle_at_center,white,transparent)]", "h-full pt-3"
                )}
              />
          </motion.div>
        )
      case "dashboard":
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <main className="container mx-auto p-4 h-full">
              <AnimatePresence mode='wait'>
                <motion.div
                  key="dashboard-title"
                  initial={{ translateY: 20, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 50,
                  }}
                >
                  <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                </motion.div>
                <motion.div
                  key="dashboard-description"
                  initial={{ translateY: 20, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 50,
                    delay: 0.1
                  }}>
                  <p className="text-lg mb-6">
                    Welcome to the dashboard. This is where you can see analytics and other
                  </p>
                </motion.div>
              </AnimatePresence>
              <Separator/>
              <Dashboard />
            </main>
          </motion.div>
        )
    }
  }

  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <VideoProvider>
      <div className="bg-background text-foreground w-full">
        <Header setPage={setPage} onLogin={handleLogin} username={username} />
        <AnimatePresence mode='wait'>
          {affichagePage()}
        </AnimatePresence>
      </div>
      </VideoProvider>
    </ThemeProvider>
  )
}

export default App