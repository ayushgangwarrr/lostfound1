import { useEffect,useState } from "react";
import { getItems } from "../utils/items";
import Navbar from "../components/Navbar";

export default function Items(){

const [items,setItems] = useState([]);
const [search,setSearch] = useState("");
const [description, setDescription] = useState("");

useEffect(()=>{
setItems(getItems());
},[]);

const filteredItems=items.filter(item=>
item.title.toLowerCase().includes(search.toLowerCase()) ||
item.location.toLowerCase().includes(search.toLowerCase())||
item.description.toLowerCase().includes(search.toLowerCase())
);

return(

<div className="p-10 bg-slate-950 min-h-screen text-white">
<Navbar />
<h1 className="text-5xl mb-6 ">
<span className="text-blue-600  text-7xl">B</span>rowse <span className=" text-3xl">items</span>
</h1>

<input
placeholder="Search lost items..."
onChange={(e)=>setSearch(e.target.value)}
className="border p-2 mb-6 rounded-2xl bg-slate-800 border-gray-700 "
/>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

{filteredItems.map(item => (

<div
key={item.id}
className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
>

<img
src={item.image || "https://via.placeholder.com/300"}
alt={item.title}
className="w-full h-40 object-cover"
/>

<div className="p-4">

<h3 className="text-white font-semibold text-lg">
{item.title}
</h3>

<p className="text-gray-400 text-sm">
{item.location}
</p>

<p className="text-blue-400 text-xs uppercase">
{item.type}
</p>

</div>

</div>

))}

</div>

</div>

)

}