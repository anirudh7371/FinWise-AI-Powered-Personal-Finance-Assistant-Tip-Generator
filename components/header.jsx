import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async () => {
  await checkUser();
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 ">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="rounded"
            />
            <span className="text-xl font-bold text-gray-700">FinWise</span>
          </Link>

          {/* Navigation Links - Different for signed in/out users */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-gray-600 hover:text-gray-800 transition-colors">
              Features
            </Link>
            <Link href="/testimonials" className="text-gray-600 hover:text-gray-800 transition-colors">
              Testimonials
            </Link>
            <Link href="/ai-tips" className="text-gray-600 hover:text-gray-800 transition-colors">
              AI Tips
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline" className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link href="/add-transaction">
                <Button className="flex items-center space-x-2">
                  <PenBox className="w-4 h-4" />
                  <span>Add Transaction</span>
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <SignInButton>
                <Button>Login</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;