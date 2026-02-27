export function LoadingCard() {
  return (
   <div className="max-w-4xl mx-auto py-10 px-4 space-y-6 animate-pulse">
      <div className="h-20 bg-gray-300 rounded-2xl"></div>

      <div className="bg-white rounded-2xl p-6 space-y-5">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>

        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}