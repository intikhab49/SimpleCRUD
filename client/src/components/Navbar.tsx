import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plus, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  onCreateClick: () => void;
}

export default function Navbar({ onCreateClick }: NavbarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get initials for avatar
  const getInitials = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-primary">
              <i className="fas fa-database mr-2"></i>
              Item Manager
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link href={location === "/" ? "/dashboard" : "/"}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {location === "/" ? "Dashboard" : "Items"}
              </Link>
            </Button>
            <Button onClick={onCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-default">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
