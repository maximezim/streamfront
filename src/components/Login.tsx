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

export function Login() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Log In</Button>
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
                <Label htmlFor="pseudo" className="text-base">Pseudo</Label>
                <Input id="pseudo" defaultValue="" className="w-full" />
            </div>
            <div className="space-y-1 w-full">
              <Label htmlFor="current" className="text-base">Mot de passe</Label>
              <Input id="current" type="password" className=" w-full" />
            </div>
        </div>
        <DialogFooter>
          <Button type="submit">Se connecter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
