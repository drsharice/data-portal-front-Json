function Catalog() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">Catalog 📚</h1>

      {/* Search Bar Placeholder */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <input
          type="text"
          placeholder="Search datasets..."
          className="flex-grow border rounded-md px-3 py-2 mr-4 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Search
        </button>
      </div>

      {/* Table Placeholder */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Available Datasets</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Schema</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Bloomberg</td>
              <td className="border p-2">Finance</td>
              <td className="border p-2">Market and trading datasets</td>
            </tr>
            <tr>
              <td className="border p-2">HR</td>
              <td className="border p-2">People</td>
              <td className="border p-2">Employee and organization data</td>
            </tr>
            <tr>
              <td className="border p-2">M365</td>
              <td className="border p-2">Productivity</td>
              <td className="border p-2">Office 365 usage metrics</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Catalog
