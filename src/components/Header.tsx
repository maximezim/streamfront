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
              <NavigationMenuContent>
                <NavigationMenuLink>Categories</NavigationMenuLink>
                <NavigationMenuLink>Live Streams</NavigationMenuLink>
                <NavigationMenuLink>Trending</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Following</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Subscriptions</NavigationMenuLink>
                <NavigationMenuLink>Favorites</NavigationMenuLink>
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