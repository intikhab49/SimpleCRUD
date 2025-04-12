import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import ItemCard from "@/components/ItemCard";
import LoadingState from "@/components/LoadingState";
import ItemFormModal from "@/components/ItemFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Item } from "@/lib/types";

export default function Home() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  // Fetch all items
  const { data: items = [], isLoading, isError } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: (newItem: Omit<Item, "id" | "createdAt">) =>
      apiRequest("POST", "/api/items", newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setIsCreateModalOpen(false);
      toast({
        title: "Success!",
        description: "Item has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: `Failed to create item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Item, "id" | "createdAt"> }) =>
      apiRequest("PUT", `/api/items/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setIsEditModalOpen(false);
      toast({
        title: "Success!",
        description: "Item has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: `Failed to update item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setIsDeleteConfirmOpen(false);
      toast({
        title: "Success!",
        description: "Item has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: `Failed to delete item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle opening create modal
  const handleOpenCreateForm = () => {
    setCurrentItem(null);
    setIsCreateModalOpen(true);
    setIsEditModalOpen(false);
  };

  // Handle opening edit modal
  const handleEdit = (item: Item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
    setIsCreateModalOpen(false);
  };

  // Handle opening delete confirmation
  const handleDelete = (item: Item) => {
    setCurrentItem(item);
    setIsDeleteConfirmOpen(true);
  };

  // Handle create/edit form submission
  const handleSubmitItem = (data: Omit<Item, "id" | "createdAt">) => {
    if (isEditModalOpen && currentItem) {
      updateItemMutation.mutate({ id: currentItem.id, data });
    } else {
      createItemMutation.mutate(data);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (currentItem) {
      deleteItemMutation.mutate(currentItem.id);
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort items based on sort option
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Format date for display
  const formatDate = (date: Date | string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar onCreateClick={handleOpenCreateForm} />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        {/* Header Section */}
        <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold text-gray-800">Items Manager</h1>
          <p className="text-gray-600">Manage your items</p>
        </div>

        {/* Filter and Search */}
        <FilterBar 
          searchTerm={searchTerm} 
          onSearch={setSearchTerm} 
          sortBy={sortBy} 
          onSort={setSortBy} 
          onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/items"] })}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading items. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && sortedItems.length === 0 && (
          <EmptyState onCreateClick={handleOpenCreateForm} />
        )}

        {/* Items Grid */}
        {!isLoading && !isError && sortedItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <ItemCard 
                key={item.id}
                item={item}
                formatDate={formatDate}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Item Modal */}
      <ItemFormModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        onSubmit={handleSubmitItem}
        item={currentItem}
        isEdit={isEditModalOpen}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={deleteItemMutation.isPending}
      />
    </div>
  );
}
