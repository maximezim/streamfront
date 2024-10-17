import Login from "@/components/Login"
import { Button } from "./ui/button"

interface HeaderProps {
  onLogin: (username: string) => void
  setPage: (page: string) => void
  username : string 
}

const Header = ({ onLogin, setPage, username }: HeaderProps) => {

  const headlog = (username: string) => {
    if(username != '') {
      return (
        <p className="font-semibold mr-4 text-sm">{username}</p>
      )
    }else{
      return( 
        <>
        <Login onLogin={onLogin} />
        </>
      )
    }
  }
  
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-background shadow-sm z-20 relative">
      <div className="flex items-center">
        <div className="mr-4">
          <div className="w-10 h-10 bg-primary rounded-full"></div>
        </div>
        <nav className="flex space-x-4">
          <Button variant="ghost" className="text-sm" onClick={() => setPage("home")}>Home</Button>
          <Button variant="ghost" className="text-sm" onClick={() => setPage("dashboard")}>Dashboard</Button>
        </nav>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {headlog(username)}
      </div>
    </header>
  )
}

export default Header