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
