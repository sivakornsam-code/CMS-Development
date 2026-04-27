// Mock data for ThaiPass CMS

export const mockStats = {
  appDownloads: 48320,
  activeUsers: 31450,
  activeAffiliateUsers: 8920,
  affiliateContribution: 28.4,
  totalRevenue: 12480500,
  totalOrders: 9842,
};

export const mockProductPerformance = [
  { name: "ThaiPass Lite", orders: 3210, revenue: 2890000, usage: 3100 },
  { name: "ThaiPass Plus", orders: 2450, revenue: 4900000, usage: 2380 },
  { name: "ThaiPass Pro", orders: 1820, revenue: 5460000, usage: 1790 },
  { name: "Airport Transfer", orders: 980, revenue: 980000, usage: 960 },
  { name: "eSIM 7D", orders: 760, revenue: 456000, usage: 730 },
  { name: "Travel Insurance", orders: 420, revenue: 294000, usage: 415 },
];

export const revenueChartData = [
  { month: "Nov", gross: 980000, net: 784000 },
  { month: "Dec", gross: 1240000, net: 992000 },
  { month: "Jan", gross: 1080000, net: 864000 },
  { month: "Feb", gross: 1380000, net: 1104000 },
  { month: "Mar", gross: 1560000, net: 1248000 },
  { month: "Apr", gross: 1820000, net: 1456000 },
];

export const revenueByProduct = [
  { name: "ThaiPass Lite", orders: 3210, grossRevenue: 2890000, netRevenue: 2312000 },
  { name: "ThaiPass Plus", orders: 2450, grossRevenue: 4900000, netRevenue: 3920000 },
  { name: "ThaiPass Pro", orders: 1820, grossRevenue: 5460000, netRevenue: 4368000 },
  { name: "Airport Transfer", orders: 980, grossRevenue: 980000, netRevenue: 784000 },
  { name: "eSIM Standard", orders: 760, grossRevenue: 456000, netRevenue: 364800 },
  { name: "Travel Insurance", orders: 420, grossRevenue: 294000, netRevenue: 235200 },
];

export const commissionPayments = [
  { id: "PAY-001", name: "Bangkok Air", flow: "Payout", amount: 485000, date: "2025-04-15", updatedAt: "2025-04-15 14:32" },
  { id: "PAY-002", name: "Indian TTT", flow: "Payout", amount: 320000, date: "2025-04-10", updatedAt: "2025-04-10 09:15" },
  { id: "PAY-003", name: "AIS Partner", flow: "Return", amount: 45000, date: "2025-04-08", updatedAt: "2025-04-08 16:45" },
  { id: "PAY-004", name: "TrueMove H", flow: "Payout", amount: 290000, date: "2025-04-05", updatedAt: "2025-04-05 11:20" },
  { id: "PAY-005", name: "Thai Airways", flow: "Return", amount: 18000, date: "2025-04-02", updatedAt: "2025-04-02 13:55" },
  { id: "PAY-006", name: "Agoda Partner", flow: "Payout", amount: 195000, date: "2025-03-28", updatedAt: "2025-03-28 10:05" },
];

export const mockVendors = [
  { id: "V001", name: "Bangkok Air Services", code: "BAS", contact: "Somchai K.", email: "somchai@bangkokair.th", phone: "+66-81-234-5678", status: "Active", created: "2024-10-12 09:00", updated: "2025-03-20 14:30" },
  { id: "V002", name: "AIS eSIM", code: "AIS", contact: "Nattaya P.", email: "nattaya@ais.th", phone: "+66-82-345-6789", status: "Active", created: "2024-11-05 10:15", updated: "2025-04-01 09:45" },
  { id: "V003", name: "TrueMove H", code: "TMH", contact: "Kittipong S.", email: "kittipong@true.th", phone: "+66-83-456-7890", status: "Active", created: "2024-11-18 11:30", updated: "2025-03-25 16:20" },
  { id: "V004", name: "Muang Thai Life", code: "MTL", contact: "Pimchanok W.", email: "pimchanok@muangthai.th", phone: "+66-84-567-8901", status: "Active", created: "2024-12-01 08:45", updated: "2025-02-14 12:10" },
  { id: "V005", name: "AOT FastPass", code: "AOT", contact: "Thanakorn B.", email: "thanakorn@aot.th", phone: "+66-85-678-9012", status: "Inactive", created: "2024-12-20 13:00", updated: "2025-01-30 10:55" },
  { id: "V006", name: "Indian TTT", code: "ITTT", contact: "Raj Sharma", email: "raj@indianttt.com", phone: "+91-98765-43210", status: "Active", created: "2025-01-08 09:30", updated: "2025-04-10 08:00" },
];

export const mockPartners = [
  { id: "P001", name: "Indian TTT", code: "ITTT", contact: "Raj Sharma", email: "raj@indianttt.com", phone: "+91-98765-43210", status: "Active", attribution: "First touch", duration: "Lifetime", created: "2024-10-15 09:00", updated: "2025-04-01 14:00" },
  { id: "P002", name: "Agoda Travel", code: "AGOD", contact: "Sarah Chen", email: "sarah@agoda.com", phone: "+65-9876-5432", status: "Active", attribution: "First touch", duration: "Lifetime", created: "2024-11-20 10:30", updated: "2025-03-15 11:45" },
  { id: "P003", name: "KKday Thailand", code: "KKDY", contact: "Wanchai A.", email: "wanchai@kkday.com", phone: "+66-86-789-0123", status: "Active", attribution: "First touch", duration: "Lifetime", created: "2024-12-10 14:00", updated: "2025-02-28 09:30" },
  { id: "P004", name: "Klook Asia", code: "KLOOK", contact: "Ming Li", email: "ming.li@klook.com", phone: "+852-9876-5432", status: "Inactive", attribution: "First touch", duration: "Lifetime", created: "2025-01-05 11:00", updated: "2025-03-01 15:20" },
  { id: "P005", name: "TripAdvisor TH", code: "TRIP", contact: "Emma Davis", email: "emma@tripadvisor.com", phone: "+1-617-555-0123", status: "Active", attribution: "First touch", duration: "Lifetime", created: "2025-01-22 09:45", updated: "2025-04-10 10:15" },
];

export const mockAffiliateLinks = [
  { id: "AL001", name: "ITTT Homepage Banner", partner: "Indian TTT", url: "https://app.thaipass.com/ref/ITTT-HPB-001", status: "Active", code: "ITTT-HPB-001", clicks: 12450, registrations: 1840, purchases: 620, conversionRate: 4.98 },
  { id: "AL002", name: "Agoda Listing Link", partner: "Agoda Travel", url: "https://app.thaipass.com/ref/AGOD-LIST-002", status: "Active", code: "AGOD-LIST-002", clicks: 8320, registrations: 1120, purchases: 385, conversionRate: 4.63 },
  { id: "AL003", name: "KKday Bundle Promo", partner: "KKday Thailand", url: "https://app.thaipass.com/ref/KKDY-BUN-003", status: "Active", code: "KKDY-BUN-003", clicks: 5670, registrations: 780, purchases: 290, conversionRate: 5.12 },
  { id: "AL004", name: "Klook Featured", partner: "Klook Asia", url: "https://app.thaipass.com/ref/KLOOK-FT-004", status: "Inactive", code: "KLOOK-FT-004", clicks: 3210, registrations: 420, purchases: 145, conversionRate: 4.52 },
  { id: "AL005", name: "TripAdvisor Review", partner: "TripAdvisor TH", url: "https://app.thaipass.com/ref/TRIP-REV-005", status: "Active", code: "TRIP-REV-005", clicks: 7890, registrations: 1050, purchases: 388, conversionRate: 4.92 },
];

export const mockOrders = [
  { id: "ORD-2025-9842", user: "john.doe@gmail.com", category: "Bundle", product: "ThaiPass Plus", amount: "2,000 THB", total: "2,140 THB", userType: "Affiliate", partner: "Indian TTT", created: "2025-04-24 09:32", updated: "2025-04-24 09:35" },
  { id: "ORD-2025-9841", user: "sarah.m@outlook.com", category: "Transport", product: "Airport Transfer", amount: "800 THB", total: "856 THB", userType: "Organic", partner: "-", created: "2025-04-24 08:55", updated: "2025-04-24 08:58" },
  { id: "ORD-2025-9840", user: "raj.sharma@gmail.com", category: "eSIM", product: "eSIM 7D Standard", amount: "550 THB", total: "588.50 THB", userType: "Affiliate", partner: "Indian TTT", created: "2025-04-23 22:10", updated: "2025-04-23 22:13" },
  { id: "ORD-2025-9839", user: "ming.l@yahoo.com", category: "Insurance", product: "Travel Insurance 14D", amount: "490 THB", total: "524.30 THB", userType: "Affiliate", partner: "KKday Thailand", created: "2025-04-23 19:45", updated: "2025-04-23 19:48" },
  { id: "ORD-2025-9838", user: "emma.w@icloud.com", category: "Bundle", product: "ThaiPass Lite", amount: "1,200 THB", total: "1,284 THB", userType: "Organic", partner: "-", created: "2025-04-23 15:20", updated: "2025-04-23 15:23" },
  { id: "ORD-2025-9837", user: "kim.j@naver.com", category: "Airport Service", product: "FastPass", amount: "350 THB", total: "374.50 THB", userType: "Affiliate", partner: "Agoda Travel", created: "2025-04-23 12:05", updated: "2025-04-23 12:08" },
  { id: "ORD-2025-9836", user: "anna.k@gmail.com", category: "Bundle", product: "ThaiPass Pro", amount: "3,500 THB", total: "3,745 THB", userType: "Organic", partner: "-", created: "2025-04-22 18:30", updated: "2025-04-22 18:33" },
  { id: "ORD-2025-9835", user: "david.tan@hotmail.com", category: "Transport", product: "Chauffeur Service", amount: "2,500 THB", total: "2,675 THB", userType: "Affiliate", partner: "TripAdvisor TH", created: "2025-04-22 14:15", updated: "2025-04-22 14:18" },
];

export const mockUsers = [
  { email: "john.doe@gmail.com", orders: 5, spend: "12,450 THB", userType: "Affiliate", partner: "Indian TTT", registered: "2024-12-10", tdac: "Verified" },
  { email: "sarah.m@outlook.com", orders: 3, spend: "5,280 THB", userType: "Organic", partner: "-", registered: "2025-01-15", tdac: "Verified" },
  { email: "raj.sharma@gmail.com", orders: 8, spend: "18,960 THB", userType: "Affiliate", partner: "Indian TTT", registered: "2024-11-20", tdac: "Verified" },
  { email: "ming.l@yahoo.com", orders: 2, spend: "3,850 THB", userType: "Affiliate", partner: "KKday Thailand", registered: "2025-02-08", tdac: "Pending" },
  { email: "emma.w@icloud.com", orders: 4, spend: "7,620 THB", userType: "Organic", partner: "-", registered: "2025-01-30", tdac: "Verified" },
  { email: "kim.j@naver.com", orders: 6, spend: "11,240 THB", userType: "Affiliate", partner: "Agoda Travel", registered: "2024-10-25", tdac: "Verified" },
  { email: "anna.k@gmail.com", orders: 9, spend: "25,800 THB", userType: "Organic", partner: "-", registered: "2024-09-14", tdac: "Verified" },
  { email: "david.tan@hotmail.com", orders: 7, spend: "19,350 THB", userType: "Affiliate", partner: "TripAdvisor TH", registered: "2024-11-05", tdac: "Verified" },
];

export const mockProducts = [
  { id: "PRD-001", code: "TP-LITE", category: "Bundle", name: "ThaiPass Lite", status: "Display", created: "2024-10-01 09:00", updated: "2025-03-15 14:30" },
  { id: "PRD-002", code: "TP-PLUS", category: "Bundle", name: "ThaiPass Plus", status: "Display", created: "2024-10-01 09:00", updated: "2025-04-01 10:00" },
  { id: "PRD-003", code: "TP-PRO", category: "Bundle", name: "ThaiPass Pro", status: "Display", created: "2024-10-01 09:00", updated: "2025-04-01 10:00" },
  { id: "PRD-004", code: "TRANS-APT", category: "Transport", name: "Airport Transfer (Standard)", status: "Display", created: "2024-11-15 10:00", updated: "2025-02-20 09:30" },
  { id: "PRD-005", code: "TRANS-CHF", category: "Transport", name: "Chauffeur Service", status: "Display", created: "2024-11-15 10:00", updated: "2025-03-01 11:45" },
  { id: "PRD-006", code: "ESIM-7STD", category: "eSIM", name: "eSIM 7D Standard", status: "Display", created: "2024-12-01 08:00", updated: "2025-01-20 13:00" },
  { id: "PRD-007", code: "ESIM-30UNL", category: "eSIM", name: "eSIM 30D Unlimited", status: "Display", created: "2024-12-01 08:00", updated: "2025-02-10 16:00" },
  { id: "PRD-008", code: "FP-STD", category: "Airport Service", name: "FastPass Standard", status: "Display", created: "2025-01-10 09:00", updated: "2025-04-05 10:30" },
  { id: "PRD-009", code: "INS-14D", category: "Insurance", name: "Travel Insurance 14D", status: "Display", created: "2025-01-20 11:00", updated: "2025-03-30 09:15" },
  { id: "PRD-010", code: "CPN-TRANS", category: "Coupons", name: "Transport 500 Discount", status: "Hide", created: "2025-02-01 10:00", updated: "2025-02-01 10:00" },
];

export const mockVouchers = [
  { id: "VOU-001", code: "VC-TRANS500", name: "Transport 500 THB Discount", actionType: "Issue Voucher", source: "Transport 500 Discount", status: "Active", updated: "2025-04-01 10:00", created: "2025-01-15 09:00" },
  { id: "VOU-002", code: "VC-ESIM7", name: "Free eSIM 7D", actionType: "Issue Product + Voucher", source: "eSIM 7D Standard", status: "Active", updated: "2025-03-20 14:00", created: "2025-01-20 11:00" },
  { id: "VOU-003", code: "VC-FP1", name: "FastPass Entry (1x)", actionType: "Issue Product + Voucher", source: "FastPass Standard", status: "Active", updated: "2025-04-10 09:00", created: "2025-02-01 08:00" },
  { id: "VOU-004", code: "VC-LOUNGE", name: "Airport Lounge Access", actionType: "Track Only", source: "Lounge Internal", status: "Inactive", updated: "2025-02-15 16:00", created: "2025-02-10 10:00" },
  { id: "VOU-005", code: "VC-SUPP", name: "Priority Support Upgrade", actionType: "Track Only", source: "Support Internal", status: "Active", updated: "2025-03-25 11:00", created: "2025-02-20 09:00" },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};
