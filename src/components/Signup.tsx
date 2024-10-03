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
        <Button>S'inscrire</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Inscription</DialogTitle>
          <DialogDescription>
            Créez un compte en remplissant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pt-3 pb-4">
          <div className="space-y-1 w-full">
            <Label htmlFor="pseudo" className="text-base">Pseudo</Label>
            <Input id="pseudo" defaultValue="" placeholder="Votre pseudo" className="w-full" />
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Votre email"
              className="w-full"
            />
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="password" className="text-base">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
        <DialogTrigger asChild>
            <Button variant="destructive">Annuler</Button>
          </DialogTrigger>
          <Button type="submit">S'inscrire</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
