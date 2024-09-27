import { Button } from "@/components/ui/button"

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
                  <p className="text-sm leading-tight py-3">Live Streams</p>
                </NavigationMenuLink>
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3">Trending</p>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Following</NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col px-7 w-full divide-y">  
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3">Subscriptions</p>
                </NavigationMenuLink>
                <NavigationMenuLink className="w-32">
                  <p className="text-sm leading-tight py-3">Favorites</p>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="ml-auto">
        <Button variant="outline" className="mr-2">Log In</Button>
        <Button>Sign Up</Button>
      </div>
    </header>
  )
}

export default Header