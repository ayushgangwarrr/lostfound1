import React from "react";

export default function GlassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Ambient Glowing Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-purple-600/10 blur-[130px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-30 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-emerald-500/10 blur-[140px] animate-float-slow" />
      <div className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-t from-indigo-700/25 via-purple-600/20 to-blue-500/10 blur-[150px] animate-float-reverse" />

      {/* Spatial 3D Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
        }}
      />

      {/* Subtle vignette border depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.7)_100%)]" />
    </div>
  );
}
