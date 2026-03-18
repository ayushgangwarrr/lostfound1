export default function QuickEntry() {
    const items = [
      "Other",
      "Belt",
      "Sunglasses",
      "License",
      "Hat",
      "Tablet",
      "Glasses",
      "Jacket",
      "Laptop"
    ]
  
    return (
      <div className="ml-60 p-6">
  
        <h2 className="text-xl font-bold mb-4">
          Quick Entry
        </h2>
  
        <div className="grid grid-cols-5 gap-4">
  
          {items.map((item) => (
            <div
              key={item}
              className="border p-4 text-center rounded hover:shadow cursor-pointer"
            >
              {item}
            </div>
          ))}
  
        </div>
  
      </div>
    )
  }