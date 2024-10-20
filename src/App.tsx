import { useState, useEffect, useContext } from 'react'
import { ThemeProvider } from './components/theme-provider'
import Header from './components/Header'
import VideoPlayer from './components/VideoPlayer'
import { Streams } from './components/Streams'
import { Chat } from './components/Chat'
import { Dashboard } from './components/Dashboard'
import { Separator } from './components/ui/separator'
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { motion, AnimatePresence } from 'framer-motion'

import brokerContext from './broker_context';
import { requestVideoPacket } from './broker';

function App() {
  const [username, setUsername] = useState('');
  const [page, setPage] = useState("home");

  const {streamList} = useContext(brokerContext);

  const toStream = (id: string) => {
    requestVideoPacket(id);
    setPage("stream");
  }

  const handleLogin = (username: string) => {
    setUsername(username);
  }

  useEffect(() => {
    const loadInitialData = async () => {

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
                <Streams items={streamList} toStream={toStream} />
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
                  <Chat username={username}/>
                </div>
              </div>
            </main>
            
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
      <div className="bg-background text-foreground w-full">
        <Header setPage={setPage} onLogin={handleLogin} username={username} />
        <AnimatePresence mode='wait'>
          {affichagePage()}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

export default App