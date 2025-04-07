// components/Pagination.jsx
const Pagination = ({ page, setPage, total }) => {
  return (
    <div className="flex justify-center items-center mt-8 space-x-6">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className={`px-5 py-2 rounded-lg border font-medium transition ${
          page === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 text-gray-700"
        }`}
      >
        ← Prev
      </button>

      <span className="text-gray-600 text-lg font-semibold">
        Page {page} of {total}
      </span>

      <button
        disabled={page === total}
        onClick={() => setPage((p) => p + 1)}
        className={`px-5 py-2 rounded-lg border font-medium transition ${
          page === total
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 text-gray-700"
        }`}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
