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
import { useState } from "react"

interface LoginProps {
  onLogin: (username: string) => void
}

const Login = ({ onLogin }: LoginProps) => {

  const [pseudo, setPseudo] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleLogin = () => {
    onLogin(pseudo)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">My pseudo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">My pseudo</DialogTitle>
          <DialogDescription>
            Enter the pseudo you want to use
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pt-3 pb-4">
        <div className="space-y-1 w-full">
            <Label htmlFor="pseudo" className="text-base">
              Pseudo
            </Label>
            <Input
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleLogin}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Login
