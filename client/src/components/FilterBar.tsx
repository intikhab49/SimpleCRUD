import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  sortBy: "name" | "date";
  onSort: (sort: "name" | "date") => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function FilterBar({ 
  searchTerm, 
  onSearch, 
  sortBy, 
  onSort, 
  onRefresh,
  isLoading 
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-grow">
          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search items..."
              className="pl-10"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => onSort(value as "name" | "date")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="date">Sort by Date</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3"
          >
            <i className={`fas fa-sync-alt ${isLoading ? "animate-spin" : ""}`}></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
