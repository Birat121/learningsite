import React from "react";

const AddPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Add Item</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter item name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter item description"
          />
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPage;
