export default function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin text-primary text-4xl mb-4">
        <i className="fas fa-circle-notch"></i>
      </div>
      <p className="text-gray-600">Loading items...</p>
    </div>
  );
}
