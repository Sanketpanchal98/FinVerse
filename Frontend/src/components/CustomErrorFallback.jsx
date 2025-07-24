// components/CustomErrorFallback.jsx
const CustomErrorFallback = ({ error, resetErrorBoundary }) => {
    
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-semibold text-red-600">Something went wrong</h2>
      {/* <p className="text-gray-700 mt-2">{error.response.data.message}</p> */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={resetErrorBoundary}
      >
        Try Again
      </button>
    </div>
  );
};

export default CustomErrorFallback;
