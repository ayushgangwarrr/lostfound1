import React from "react";
import { useNavigate } from "react-router-dom";
import Tilt3DCard from "./Tilt3DCard";

export default function DashboardCards() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Found Item Entry",
      desc: "Register a found item to connect with owner",
      icon: "🎁",
      gradient: "from-blue-600/30 to-indigo-600/30",
      accent: "text-blue-400",
      link: "/report-found",
    },
    {
      title: "Browse All Records",
      desc: "View complete lost & found campus database",
      icon: "🗂️",
      gradient: "from-emerald-600/30 to-teal-600/30",
      accent: "text-emerald-400",
      link: "/items",
    },
    {
      title: "Report Lost Item",
      icon: "🚨",
      desc: "File a lost item inquiry for immediate alerts",
      gradient: "from-rose-600/30 to-amber-600/30",
      accent: "text-rose-400",
      link: "/report-lost",
    },
    {
      title: "AI & Socket Chat",
      icon: "💬",
      desc: "Chat directly with finders and claim items",
      gradient: "from-purple-600/30 to-pink-600/30",
      accent: "text-purple-400",
      link: "/messages",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {cards.map((card) => (
        <Tilt3DCard
          key={card.title}
          onClick={() => navigate(card.link)}
          className="p-6 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} border border-white/15 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
              {card.icon}
            </div>
            <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {card.title}
            </h2>
            <p className="text-gray-300 text-xs mt-1.5 leading-relaxed">
              {card.desc}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold pt-3 border-t border-white/10">
            <span className={card.accent}>Quick Action</span>
            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Tilt3DCard>
      ))}
    </div>
  );
}