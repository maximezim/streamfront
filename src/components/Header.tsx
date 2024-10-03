import Login from "@/components/Login"
import { Signup } from "@/components/Signup"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface HeaderProps {
  onLogin: (username: string) => void
  setPage: (page: string) => void
  username : string 
}

const Header = ({ onLogin, setPage, username }: HeaderProps) => {

  const headlog = (username: string) => {
    if(username != '') {
      return (
        <p className="font-semibold mr-4">{username}</p>
      )
    }else{
      return( 
        <>
        <Login onLogin={onLogin} />
        <Signup />
        </>
      )
    }
  }
  
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-background">
      <div className="flex items-center">
        <div className="mr-4">
          <div className="w-10 h-10 bg-primary rounded-full"></div>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col px-7 w-full divide-y"> 
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3 cursor-pointer" onClick={()=> setPage("home")}>Home</p>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Data</NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col px-7 w-full divide-y">  
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3 cursor-pointer" onClick={()=> setPage("dashboard")}>Dashboard</p>
                </NavigationMenuLink> 
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {headlog(username)}
      </div>
    </header>
  )
}

export default Header