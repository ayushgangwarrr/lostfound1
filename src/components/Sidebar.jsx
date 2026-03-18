export default function Sidebar() {
    return (
      <div className="w-60 h-screen bg-blue-600 text-white p-4 fixed">
  
        <h1 className="text-xl font-bold mb-8">
          Lost & Found
        </h1>
  
        <ul className="space-y-4">
  
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
            Dashboard
          </li>
  
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
            Add Entry
          </li>
  
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
            Show Entries
          </li>
  
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
            Matching
          </li>
  
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
            Statistics
          </li>
  
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
            Settings
          </li>
  
        </ul>
      </div>
    )
  }