export function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    Inactive: "bg-slate-100 text-slate-500",
    Display: "bg-emerald-100 text-emerald-700",
    Hide: "bg-slate-100 text-slate-500",
    Organic: "bg-sky-100 text-sky-700",
    Affiliate: "bg-violet-100 text-violet-700",
    Verified: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Payout: "bg-red-100 text-red-700",
    Return: "bg-emerald-100 text-emerald-700",
  };
  const cls = colorMap[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
