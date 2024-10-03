import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginProps {
  onLogin: (username: string) => void
}

export function Login({ onLogin }: LoginProps) {
  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleLogin = () => {
    onLogin(pseudo)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Connexion</DialogTitle>
          <DialogDescription>
            Entrez vos identifiants pour vous connecter à votre compte.
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
          <div className="space-y-1 w-full">
            <Label htmlFor="current" className="text-base">
              Mot de passe
            </Label>
            <Input
              id="current"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" onClick={handleLogin}>
            Se connecter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
