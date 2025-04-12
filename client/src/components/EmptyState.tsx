import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Card className="bg-white rounded-lg shadow-sm p-8 text-center">
      <CardContent className="pt-6">
        <div className="text-gray-400 text-6xl mb-4">
          <i className="fas fa-box-open"></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Items Found</h2>
        <p className="text-gray-500 mb-4">There are no items to display. Get started by adding a new item.</p>
        <Button onClick={onCreateClick}>
          <i className="fas fa-plus mr-2"></i>
          Add Your First Item
        </Button>
      </CardContent>
    </Card>
  );
}
