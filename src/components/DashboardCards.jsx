export default function DashboardCards() {
    return (
      <div className="grid grid-cols-4 gap-4 p-6 ml-60">
  
        <div className="bg-blue-500 text-white p-6 rounded">
          <h2 className="text-xl font-bold">Found Item Entry</h2>
          <p>Register Found Item</p>
        </div>
  
        <div className="bg-red-400 text-white p-6 rounded">
          <h2 className="text-xl font-bold">All Entries</h2>
          <p>View all records</p>
        </div>
  
        <div className="bg-green-400 text-white p-6 rounded">
          <h2 className="text-xl font-bold">Lost Item Inquiry</h2>
          <p>Check lost reports</p>
        </div>
  
        <div className="bg-yellow-400 text-white p-6 rounded">
          <h2 className="text-xl font-bold">Matching</h2>
          <p>See possible matches</p>
        </div>
  
      </div>
    )
  }