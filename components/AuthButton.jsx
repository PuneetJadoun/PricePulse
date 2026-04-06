"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { SignOut } from "@/app/actions";


const AuthButton = ({ user }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  

  if (user) {
    return (
      <form action={SignOut}>
        <Button variant="ghost" size="sm" type="submit" className="gap-2">
          <LogOut className="w-4 h-4" />
          SignOut
        </Button>
      </form>
    );
  }
  return (
    <>
      {/* Auth Button */}
        <Button
            onClick={() => setShowAuthModal(true)}    
            variant="default"
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 gap-2 text-lg px-4 py-5"
      >
        <LogIn className="w-4 h-4" />
        Sign In
       </Button>
          
        <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
        />
    </>      
  );
}

export default AuthButton;