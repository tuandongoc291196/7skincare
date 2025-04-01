import { reportOrders, reportRevenue, reportStatus } from "@/apis/report";
import { useQuery } from "@tanstack/react-query";
import { Container, Grid, Typography, CircularProgress, Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TotalRevenue } from "@/components/card/TotalRevenue";
import { RevenueChart } from "@/components/chart/RevenueChart";
import { TopProductsTable } from "@/components/table/TopProductsTable";
import StatusesCard from "@/components/card/StatusesCard";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface ReportOrders {
  id: number;
  name: string;
  quantity: number;
}

export interface ReportRevenue {
  totalRevenue: number;
  revenueReportByDay: { date: string; totalPrice: number }[];
}

const Report = () => {
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["get-revenue"],
    queryFn: () => reportRevenue(),
  });

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["get-orders-report"],
    queryFn: () => reportOrders(),
  });

  const { data: statusesData, isLoading: isLoadingStatuses } = useQuery({
    queryKey: ["get-statuses-report"],
    queryFn: () => reportStatus(),
  });
  if (isLoadingRevenue || isLoadingOrders || isLoadingStatuses) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}>
        Báo Cáo Doanh Số
      </Typography>

      <Grid container spacing={3}>
        <TotalRevenue revenue={revenueData?.totalRevenue} />
        <RevenueChart data={revenueData} />
        <Grid item xs={12}>
          <Box display="flex" gap={3}>
            <Box sx={{ flex: 1 }}>
              <TopProductsTable products={ordersData} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <StatusesCard data={statusesData} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Report;
