import React, { useState } from "react";
import Tilt3DCard from "./Tilt3DCard";

export default function GlassHero3D() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none perspective-2000">
      {/* 3D Glass Multi-Layered Hero Card */}
      <Tilt3DCard className="p-8 border border-white/20 bg-slate-900/70 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(37,99,235,0.3)]">
        {/* Top Header Layer with 3D elevation */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 translate-z-30">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <span className="ml-2 text-xs font-mono text-blue-300/80 uppercase tracking-widest">
              Live Campus Matrix
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Active Sync
          </div>
        </div>

        {/* 3D Visual Center Display */}
        <div className="py-8 space-y-5 transform-style-3d">
          {/* Layer 1: Floating Glass Item Showcase Card */}
          <div className="relative p-5 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-white/15 backdrop-blur-md shadow-lg translate-z-40 transition-transform duration-300 hover:translate-z-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 text-2xl font-bold shadow-inner">
                  📱
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    JUST REPORTED
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">iPhone 14 Pro Max</h4>
                  <p className="text-xs text-gray-300">Found near SAC Auditorium</p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Verified Match
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/10">
              <span>Owner: Roll 122CS0491</span>
              <span className="text-blue-300 font-semibold cursor-pointer hover:underline">
                Contact Finder →
              </span>
            </div>
          </div>

          {/* Layer 2: Secondary Floating Glass Card */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-white/10 backdrop-blur-md translate-z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 text-xl">
                🎒
              </div>
              <div>
                <h5 className="text-sm font-semibold text-white">Black Wildcraft Bag</h5>
                <p className="text-xs text-gray-400">Library 2nd Floor Reading Room</p>
              </div>
            </div>
            <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              Lost
            </span>
          </div>

          {/* Layer 3: Stats Floating Row */}
          <div className="grid grid-cols-3 gap-3 pt-2 translate-z-30">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
              <p className="text-xl font-extrabold text-blue-400">98%</p>
              <p className="text-[11px] text-gray-400">Recovery Rate</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
              <p className="text-xl font-extrabold text-cyan-400">1,420+</p>
              <p className="text-[11px] text-gray-400">Items Returned</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
              <p className="text-xl font-extrabold text-purple-400">⚡ 15m</p>
              <p className="text-[11px] text-gray-400">Avg. Response</p>
            </div>
          </div>
        </div>

        {/* Outer 3D Floating Pill Badges */}
        <div className="absolute -top-5 -right-5 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-full text-xs font-bold text-white shadow-xl shadow-blue-500/30 border border-white/30 animate-float-slow">
          ✨ 3D Glass Hub
        </div>
        <div className="absolute -bottom-6 -left-6 z-40 bg-slate-900/90 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-semibold text-gray-200 shadow-2xl flex items-center gap-2 animate-float-reverse">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          NIT Rourkela Verified Platform
        </div>
      </Tilt3DCard>
    </div>
  );
}
