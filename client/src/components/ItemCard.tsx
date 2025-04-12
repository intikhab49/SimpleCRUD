import { Item } from "@/lib/types";

interface ItemCardProps {
  item: Item;
  formatDate: (date: Date | string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ItemCard({ item, formatDate, onEdit, onDelete }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <div className="text-sm text-gray-500 mb-4">
          <span className="inline-block">Created: {formatDate(item.createdAt)}</span>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between">
        <button 
          className="text-primary hover:text-primary-dark transition-colors duration-200"
          onClick={onEdit}
        >
          <i className="fas fa-edit mr-1"></i> Edit
        </button>
        <button 
          className="text-destructive hover:text-red-600 transition-colors duration-200"
          onClick={onDelete}
        >
          <i className="fas fa-trash-alt mr-1"></i> Delete
        </button>
      </div>
    </div>
  );
}
