import { Login } from "@/components/Login"
import { Signup } from "@/components/Signup"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"


const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-background">
      <div className="flex items-center">
        <div className="mr-4">
          {/* Placeholder for logo */}
          <div className="w-10 h-10 bg-primary rounded-full"></div>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col px-7 w-full divide-y">  
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3 cursor-pointer">Live Streams</p>
                </NavigationMenuLink>
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3 cursor-pointer">Trending</p>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Following</NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col px-7 w-full divide-y">  
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3 cursor-pointer">Subscriptions</p>
                </NavigationMenuLink>
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3 cursor-pointer">Favorites</p>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Login />
        <Signup />
      </div>
    </header>
  )
}

export default Header