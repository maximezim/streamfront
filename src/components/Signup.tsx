import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function Signup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign up</DialogTitle>
          <DialogDescription>
            Create an account by filling out the information below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pt-3 pb-4">
          <div className="space-y-1 w-full">
            <Label htmlFor="pseudo" className="text-base">Pseudo</Label>
            <Input id="pseudo" defaultValue="" placeholder="Your pseudo" className="w-full" />
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Sign up</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
