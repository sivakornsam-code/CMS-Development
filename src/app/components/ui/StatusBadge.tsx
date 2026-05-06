export function StatusBadge({ status, variant }: { status: string; variant?: "esim" }) {
  const baseMap: Record<string, string> = {
    // generic
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
    // FastPass
    "Not verified": "bg-amber-100 text-amber-700",
    "Ready to use": "bg-green-100 text-green-700",
    Confirmed: "bg-emerald-100 text-emerald-700",
    Redeemed: "bg-blue-100 text-blue-700",
    Expired: "bg-red-100 text-red-700",
    // Transportation
    Assigned: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
    Complete: "bg-emerald-100 text-emerald-700",
    // eSIM statuses
    "Not Installed": "bg-slate-100 text-slate-500",
    "Out of Data": "bg-orange-100 text-orange-700",
    // Insurance
    "Not submitted": "bg-slate-100 text-slate-500",
    Rejected: "bg-orange-100 text-orange-700",
    Purchased: "bg-sky-100 text-sky-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Expired: "bg-red-100 text-red-700",
  };

  // eSIM variant: Inactive is blue instead of grey
  const esimOverrides: Record<string, string> = {
    Inactive: "bg-blue-100 text-blue-700",
  };

  const colorMap = variant === "esim" ? { ...baseMap, ...esimOverrides } : baseMap;
  const cls = colorMap[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
