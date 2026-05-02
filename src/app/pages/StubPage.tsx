import { Construction } from "lucide-react";

export function StubPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Construction size={28} className="text-slate-400" />
      </div>
      <h2 className="text-slate-800 text-lg font-semibold mb-2">{title}</h2>
      <p className="text-slate-400 text-sm max-w-sm">
        {description || "This section is under development. Content coming soon."}
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        Phase 2 — Coming Soon
      </div>
    </div>
  );
}
