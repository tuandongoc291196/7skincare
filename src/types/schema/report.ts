export interface ReportOrders {
  id: number;
  name: string;
  quantity: number;
}

export interface ReportRevenue {
  totalRevenue: number;
  revenueReportByDay: { date: string; totalPrice: number }[];
}
