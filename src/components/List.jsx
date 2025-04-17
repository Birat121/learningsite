import React from "react";

const ListPage = () => {
  // For now, using mock data
  const items = [
    { id: 1, name: "Item 1", description: "Description of Item 1" },
    { id: 2, name: "Item 2", description: "Description of Item 2" },
    { id: 3, name: "Item 3", description: "Description of Item 3" },
  ];

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">List of Items</h2>
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b text-left">ID</th>
            <th className="px-4 py-2 border-b text-left">Name</th>
            <th className="px-4 py-2 border-b text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{item.id}</td>
              <td className="px-4 py-2 border-b">{item.name}</td>
              <td className="px-4 py-2 border-b">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPage;
