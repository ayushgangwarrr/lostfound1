export default function GlassHero3D() {
  const updates = [
    { title: "Wallet found", location: "SAC arena", tag: "Found" },
    { title: "ID card lost", location: "Library", tag: "Lost" },
    { title: "AirPods found", location: "Mechanical block", tag: "Found" },
  ];

  return (
    <div className="mx-auto w-full max-w-lg rounded-[30px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl lg:max-w-none">
      <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Campus board</span>
      </div>

      <div className="space-y-3">
        {updates.map((item, index) => (
          <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-300">
                {index === 0 ? "👜" : index === 1 ? "🪪" : "🎧"}
              </div>
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-slate-400">{item.location}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                item.tag === "Found" ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"
              }`}
            >
              {item.tag}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Today</span>
          <span className="text-xs text-blue-300">3 new posts</span>
        </div>
        <p className="text-base font-medium text-white">A straightforward way to recover what matters.</p>
      </div>
    </div>
  );
}
