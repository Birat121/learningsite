const FiltersSidebar = ({ filters, setFilters }) => {
  const handleCategoryChange = (cat) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handlePriceChange = (e) => {
    setFilters((prev) => ({ ...prev, price: e.target.value }));
  };

  const handleReset = () => {
    setFilters({ categories: [], price: "" });
  };

  return (
    <div className="w-full space-y-6 p-6 bg-white shadow rounded-xl">
      {/* Categories */}
      <div>
        <h4 className="font-bold text-lg mb-3">Categories</h4>
        <div className="space-y-2">
          {["Arts & Crafts", "Coaching", "Online Business", "Real Estate"].map((cat) => (
            <label key={cat} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-yellow-500"
                checked={filters.categories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-bold text-lg mb-3">Price</h4>
        <div className="space-y-2">
          {["Free", "Paid"].map((price) => (
            <label key={price} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value={price}
                className="accent-yellow-500"
                checked={filters.price === price}
                onChange={handlePriceChange}
              />
              <span>{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-4">
        <button
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition"
          onClick={() => {}}
          disabled
          title="Apply filter functionality not implemented"
        >
          Apply
        </button>
        <button
          className="flex-1 border border-gray-400 hover:border-gray-600 text-gray-700 font-medium py-2 rounded transition"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
