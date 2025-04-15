import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plus } from "lucide-react";

interface NavbarProps {
  onCreateClick: () => void;
}

export default function Navbar({ onCreateClick }: NavbarProps) {
  const [location] = useLocation();

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
          <div className="flex items-center space-x-2">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
