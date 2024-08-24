// src/components/Header.tsx
import { UserButton } from "@clerk/nextjs";
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-end px-4 py-3">
        <Button variant="ghost" size="icon" className="mr-2">
          <Bell className="h-5 w-5" />
        </Button>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  )
}

export default Header