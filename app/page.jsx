import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Home() {
    return <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 flex justify-between items-center">
            
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Image src={"/logo.png"} alt="Logo"
                    width={600}
                    height={200}
                        className="h-10 w-auto"
                    />gap
                </div>

                {/* Auth Button */}
                <Button variant="default" size="sm" className="bg-orage-500 hover:bg-orange-600 gap-2">
                    <LogIn className="w-4 h-4" />    
                    Sign In
                </Button>
            </div>    
        </header> 
    </main>
}