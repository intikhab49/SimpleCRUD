import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Item } from "@/lib/types";
import { format } from "date-fns";
import { Loader2, ArrowRight, Plus, BarChart3, ListFilter, CalendarDays } from "lucide-react";
import { useState } from "react";
import ItemFormModal from "@/components/ItemFormModal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading dashboard data. Please try again.</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/items"] })}
          variant="outline"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Calculate stats
  const totalItems = items.length;
  const recentItems = items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "PPP");
  };

  const handleCreateItem = async (formData: any) => {
    try {
      await apiRequest('POST', '/api/items', formData);
      
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setIsCreateModalOpen(false);
      
      toast({
        title: 'Success',
        description: 'Item created successfully!',
      });
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to create item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your items and statistics</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild variant="outline">
            <Link href="/">
              <ListFilter className="mr-2 h-4 w-4" />
              View All Items
            </Link>
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">Items in your database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Items Added Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {items.filter(item => {
                const today = new Date();
                const itemDate = new Date(item.createdAt);
                return itemDate.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">New items today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {items.length > 0 
                ? formatDate(items.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )[0].createdAt) 
                : "No items yet"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last item creation date</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recently Added */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recently Added</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {recentItems.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="rounded-full bg-primary/10 p-3 inline-flex mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No items yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't added any items to your dashboard yet.
                </p>
                <Button asChild>
                  <Link href="/">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Item
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    {formatDate(item.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description || "No description provided"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Item Modal */}
      <ItemFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateItem}
        item={null}
        isEdit={false}
      />
    </div>
  );
}