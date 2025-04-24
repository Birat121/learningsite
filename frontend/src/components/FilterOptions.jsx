const FiltersSidebar = ({ filters, setFilters }) => {
  const handlePropertyTypeChange = (type) => {
    setFilters((prev) => {
      const exists = prev.propertyTypes.includes(type);
      return {
        ...prev,
        propertyTypes: exists
          ? prev.propertyTypes.filter((t) => t !== type)
          : [...prev.propertyTypes, type],
      };
    });
  };

  const handlePriceRangeChange = (e) => {
    setFilters((prev) => ({ ...prev, priceRange: e.target.value }));
  };

  const handleReset = () => {
    setFilters({ propertyTypes: [], priceRange: "" });
  };

  return (
    <div className="w-full space-y-6 p-6 bg-white shadow rounded-xl">
      {/* Property Types */}
      <div>
        <h4 className="font-bold text-lg mb-3">Property Type</h4>
        <div className="space-y-2">
          {["Apartment", "House", "Land", "Commercial", "Villa"].map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-yellow-500"
                checked={filters.propertyTypes.includes(type)}
                onChange={() => handlePropertyTypeChange(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-lg mb-3">Price Range</h4>
        <div className="space-y-2">
          {[
            "Under $50",
            "$50 - $100",
            "$100 - $250",
            "$250 - $500",
            "Above $500",
          ].map((range) => (
            <label key={range} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                value={range}
                className="accent-yellow-500"
                checked={filters.priceRange === range}
                onChange={handlePriceRangeChange}
              />
              <span>{range}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-4">
        <button
          className="flex-1 bg-[rgb(0,104,80)] text-white font-semibold py-2 rounded transition"
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
