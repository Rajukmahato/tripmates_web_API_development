"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/_context/AuthContext";
import { useChat } from "@/app/_context/ChatContext";
import { useNotification } from "@/app/_context/NotificationContext";
import { Button } from "@/app/_components/ui/button";
import { Avatar } from "@/app/_components/ui/avatar";
import { Badge } from "@/app/_components/ui/badge";
import { MessageCircle, Bell, Menu } from "lucide-react";
import { useState } from "react";

// Public/Guest Navigation Component
function PublicNav() {
  return (
    <nav className="flex items-center gap-8 text-sm font-medium">
      <Link href="/" className="relative text-foreground hover:text-primary transition-colors duration-200 flex items-center group">
        <span>Home</span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
      {/* <Link href="/user/destinations" className="relative text-foreground hover:text-primary transition-colors duration-200 flex items-center group">
        <span>Destinations</span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
      </Link> */}
      <Link href="/about" className="relative text-foreground hover:text-primary transition-colors duration-200 flex items-center group">
        <span>About</span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link href="/login" className="relative text-foreground hover:text-primary transition-colors duration-200 flex items-center group">
        <span>Login</span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
      <Link href="/register" className="relative text-foreground hover:text-primary transition-colors duration-200 flex items-center group">
        <span className="bg-gradient-to-r from-purple-700 to-purple-700 bg-clip-text text-transparent">Sign Up</span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
    </nav>
  );
}

// User Navigation Component
function UserNav({ pathname, unreadMessages, unreadCount }: { pathname: string | null; unreadMessages: number; unreadCount: number }) {
  return (
    <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
      <Link 
        href="/user/dashboard" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname === '/user/dashboard' 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Dashboard</span>
        {pathname === '/user/dashboard' && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/user/trips" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/user/trips') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Trips</span>
        {pathname?.startsWith('/user/trips') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/user/destinations" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/destinations') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Destinations</span>
        {pathname?.startsWith('/destinations') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/user/requests/received" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/user/requests') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Requests</span>
        {pathname?.startsWith('/user/requests') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/user/chat" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/user/chat') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>Chat</span>
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center shadow-lg">
              {unreadMessages > 99 ? '99+' : unreadMessages}
            </span>
          )}
        </div>
        {pathname?.startsWith('/user/chat') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/user/notifications" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/user/notifications') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden lg:inline">Notifications</span>
          <span className="lg:hidden">Alerts</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center shadow-lg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        {pathname?.startsWith('/user/notifications') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/user/profile" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname === '/user/profile' 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Profile</span>
        {pathname === '/user/profile' && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
    </nav>
  );
}

// Admin Navigation Component
function AdminNav({ pathname }: { pathname: string | null }) {
  return (
    <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
      <Link 
        href="/admin" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname === '/admin' 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Dashboard</span>
        {pathname === '/admin' && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/admin/users" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/admin/users') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Users</span>
        {pathname?.startsWith('/admin/users') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/admin/trips" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/admin/trips') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Trips</span>
        {pathname?.startsWith('/admin/trips') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/admin/destinations" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/admin/destinations') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Destinations</span>
        {pathname?.startsWith('/admin/destinations') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
      <Link 
        href="/admin/analytics" 
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
          pathname?.startsWith('/admin/analytics') 
            ? 'text-primary font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
        }`}
      >
        <span>Analytics</span>
        {pathname?.startsWith('/admin/analytics') && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></span>
        )}
      </Link>
    </nav>
  );
}

// Mobile Menu Component
function MobileMenu({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  isAuthenticated, 
  isAdminArea, 
  unreadMessages, 
  unreadCount 
}: { 
  mobileMenuOpen: boolean; 
  setMobileMenuOpen: (open: boolean) => void; 
  isAuthenticated: boolean; 
  isAdminArea: boolean; 
  unreadMessages: number; 
  unreadCount: number; 
}) {
  if (!mobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        onClick={() => setMobileMenuOpen(false)}
      />
      
      {/* Menu Panel */}
      <div className="md:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 animate-slideInRight overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-1">
          {isAuthenticated ? (
            isAdminArea ? (
              <>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Dashboard
                </Link>
                <Link href="/admin/users" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Users
                </Link>
                <Link href="/admin/trips" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Trips
                </Link>
                <Link href="/admin/destinations" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Destinations
                </Link>
                <Link href="/admin/analytics" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Analytics
                </Link>
              </>
            ) : (
              <>
                <Link href="/user/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Dashboard
                </Link>
                <Link href="/user/trips" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Trips
                </Link>
                <Link href="/destinations" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Destinations
                </Link>
                <Link href="/user/requests/received" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Requests
                </Link>
                <Link href="/user/chat" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium flex items-center justify-between group">
                  <span>Chat</span>
                  {unreadMessages > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 text-xs font-bold rounded-full min-w-[24px] text-center shadow-md">
                      {unreadMessages > 99 ? '99+' : unreadMessages}
                    </span>
                  )}
                </Link>
                <Link href="/user/notifications" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium flex items-center justify-between group">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 text-xs font-bold rounded-full min-w-[24px] text-center shadow-md">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/user/profile" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                  Profile
                </Link>
              </>
            )
          ) : (
            <>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                Home
              </Link>
              <Link href="/destinations" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                Destinations
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                About
              </Link>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-2"></div>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary transition-all font-medium">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary-dark hover:to-purple-700 transition-all font-medium text-center shadow-md">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { conversations } = useChat();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show header on auth pages (login, register, etc.)
  if (pathname?.startsWith('/login') || 
      pathname?.startsWith('/register') || 
      pathname?.startsWith('/forget-password') ||
      pathname?.startsWith('/reset-password')) {
    return null;
  }

  const isAdmin = user?.role === 'admin';
  const isUserArea = pathname?.startsWith('/user');
  const isAdminArea = pathname?.startsWith('/admin');
  const isPublic = !isUserArea && !isAdminArea;

  const unreadMessages = Array.isArray(conversations) 
    ? conversations.reduce((sum, conv) => sum + (conv.unreadCount ?? 0), 0) 
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
      <div className="h-[65px] max-w-5xl px-6 lg:px-8 mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link 
            href={isAuthenticated ? (isAdmin ? '/admin' : '/user/dashboard') : '/'} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image 
              src="/images/tripmates-logo.png" 
              alt="TripMates Logo" 
              width={45}
              height={45}
              className="h-10 w-10 sm:h-12 sm:w-12"
              priority
            />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">TripMates</span>
          </Link>
          {isAdminArea && (
            <Badge variant="admin" className="text-xs font-semibold hidden sm:inline-flex">Admin</Badge>
          )}
        </div>

        {/* Navigation - Center */}
        <div className="hidden md:flex flex-1 flex justify-center">
          {isPublic && !isAuthenticated && <PublicNav />}
          {isAuthenticated && isAdminArea && <AdminNav pathname={pathname} />}
          {isAuthenticated && (isUserArea || (!isAdminArea && !isPublic)) && (
            <UserNav pathname={pathname} unreadMessages={unreadMessages} unreadCount={unreadCount} />
          )}
        </div>

        {/* Right Side - User Profile or Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 justify-end flex-shrink-0">
          {isAuthenticated ? (
            <>
              <div className="hidden lg:flex items-center gap-3 pl-3 sm:pl-4 border-l border-gray-200 dark:border-gray-700">
                <Avatar 
                  name={user?.fullName || "User"} 
                  profileImagePath={user?.profileImagePath}
                  className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                />
                <div className="hidden xl:block text-sm">
                  <p className="font-semibold text-foreground leading-tight">{user?.fullName || "User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role || "user"}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => logout()}
                className="hidden lg:inline-flex hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400 dark:hover:border-red-800 transition-all font-medium text-sm"
              >
                Logout
              </Button>
            </>
          ) : null}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-primary/10 h-10 w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <MobileMenu 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        isAdminArea={isAdminArea}
        unreadMessages={unreadMessages}
        unreadCount={unreadCount}
      />
    </header>
  );
}
