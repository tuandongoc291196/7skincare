import { ReportRevenue } from "@/types/schema/report";
import { Grid, Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";

export const RevenueChart = ({ data }: { data: ReportRevenue | undefined }) => {
  const chartData = {
    labels: data?.revenueReportByDay.map(item => item.date) || [],
    datasets: [
      {
        label: "Doanh Thu",
        data: data?.revenueReportByDay.map(item => item.totalPrice) || [],
        backgroundColor: "rgba(76, 175, 80, 0.7)",
        borderColor: "rgba(76, 175, 80, 1)",
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { font: { size: 14 } },
      },
      title: {
        display: true,
        text: "Biểu Đồ Doanh Thu Theo Ngày",
        font: { size: 18, weight: "bold" as const },
        padding: { bottom: 20 },
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Doanh Thu (VNĐ)" } },
      x: { title: { display: true, text: "Ngày" } },
    },
  };

  return (
    <Grid item xs={12}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          "&:hover": { boxShadow: 6 },
        }}
      >
        <Bar options={chartOptions} data={chartData} />
      </Paper>
    </Grid>
  );
};
