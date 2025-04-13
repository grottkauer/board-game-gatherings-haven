
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Users, LogOut, User, Dice1, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-md shadow-sm py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Dice1 className="h-6 w-6 text-board-purple" />
          <h1 className="text-xl font-bold text-board-slate dark:text-white">
            Board<span className="text-board-purple">Haven</span>
          </h1>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-board-slate dark:text-white" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-board-slate-light hover:text-board-purple transition-colors dark:text-gray-300 dark:hover:text-board-purple">
            Home
          </Link>
          <Link to="/events" className="text-board-slate-light hover:text-board-purple transition-colors dark:text-gray-300 dark:hover:text-board-purple">
            Events
          </Link>
          
          <ThemeToggle />
          
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <Avatar className="h-8 w-8 bg-board-purple text-white hover:bg-board-purple-dark transition-colors">
                    <AvatarFallback>{getInitials(user.nickname)}</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{user.nickname}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-2">
                  <Link to="/profile" className="flex items-center gap-2 text-sm hover:text-board-purple transition-colors">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link to="/my-events" className="flex items-center gap-2 text-sm hover:text-board-purple transition-colors">
                    <Users className="h-4 w-4" />
                    My Events
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" className="rounded-full">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-board-purple hover:bg-board-purple-dark rounded-full">Register</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-card shadow-md md:hidden">
            <div className="flex flex-col p-4 gap-4">
              <Link 
                to="/" 
                className="text-board-slate-light hover:text-board-purple transition-colors dark:text-gray-300 dark:hover:text-board-purple py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/events" 
                className="text-board-slate-light hover:text-board-purple transition-colors dark:text-gray-300 dark:hover:text-board-purple py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <div className="flex items-center">
                <ThemeToggle />
                <span className="ml-2 text-sm">
                  {ThemeToggle ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <Separator />
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <Avatar className="h-8 w-8 bg-board-purple text-white">
                      <AvatarFallback>{getInitials(user.nickname)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.nickname}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-sm hover:text-board-purple transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link 
                    to="/my-events" 
                    className="flex items-center gap-2 text-sm hover:text-board-purple transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    My Events
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full rounded-full">Login</Button>
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-board-purple hover:bg-board-purple-dark rounded-full">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
