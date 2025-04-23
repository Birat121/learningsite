const SearchAndSortBar = ({ search, setSearch, sort, setSort }) => (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
    <div className="text-gray-600 text-sm md:text-base">
      Showing 1–12 of 20 results
    </div>

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <select
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="latest">Newly Published</option>
        <option value="popular">Most Popular</option>
      </select>

      <input
        type="text"
        placeholder="Search our courses"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>
);

export default SearchAndSortBar;

