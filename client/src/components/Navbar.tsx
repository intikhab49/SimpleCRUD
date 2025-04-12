import { Button } from "@/components/ui/button";

interface NavbarProps {
  onCreateClick: () => void;
}

export default function Navbar({ onCreateClick }: NavbarProps) {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-semibold text-primary">
              <i className="fas fa-database mr-2"></i>
              SimpleCRUD
            </a>
          </div>
          <div className="flex items-center">
            <Button onClick={onCreateClick}>
              <i className="fas fa-plus mr-2"></i>
              Add Item
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
