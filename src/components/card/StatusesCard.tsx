import { ReportStatus } from "@/types/schema/report";
import { CardContent, Typography, Grid, Box, Tooltip, Paper } from "@mui/material";
import {
  Pending as PendingIcon,
  CheckCircle as SuccessIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  DoneAll as DoneIcon,
} from "@mui/icons-material";

interface StatusesCardProps {
  data?: ReportStatus;
}

const StatusesCard = ({ data }: StatusesCardProps) => {
  const defaultData: ReportStatus = {
    total: 0,
    pending: 0,
    approved: 0,
    canceled: 0,
    rejected: 0,
    success: 0,
    done: 0,
  };

  const statusData = data || defaultData;

  // Calculate completion percentage
  const completionPercentage =
    statusData.total > 0 ? Math.round((statusData.done / statusData.total) * 100) : 0;

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Tổng Quan Trạng Thái Đơn Hàng
          </Typography>
          <Tooltip title={`${completionPercentage}% Hoàn thành`}>
            <Typography variant="body2" color="text.secondary">
              {completionPercentage}%
            </Typography>
          </Tooltip>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tooltip title="Tổng số báo cáo">
              <Box
                sx={{
                  p: 2,
                  bgcolor: "primary.light",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" color="white">
                  Tổng Số Đơn Hàng
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.dark">
                  {statusData.total}
                </Typography>
              </Box>
            </Tooltip>
          </Grid>

          {[
            {
              label: "Đang Xử Lý",
              value: statusData.pending,
              color: "warning.main",
              icon: <PendingIcon />,
            },
            {
              label: "Đã Phê Duyệt",
              value: statusData.approved,
              color: "success.main",
              icon: <SuccessIcon />,
            },
            {
              label: "Thất Bại",
              value: statusData.canceled,
              color: "error.main",
              icon: <CancelIcon />,
            },
            {
              label: "Bị Từ Chối",
              value: statusData.rejected,
              color: "error.main",
              icon: <WarningIcon />,
            },
            {
              label: "Đã Thanh Toán",
              value: statusData.success,
              color: "success.main",
              icon: <SuccessIcon />,
            },
            {
              label: "Giao Hàng Thành Công",
              value: statusData.done,
              color: "info.main",
              icon: <DoneIcon />,
            },
          ].map(status => (
            <Grid item xs={6} key={status.label}>
              <Tooltip title={`${status.label}: ${status.value}`}>
                <Box
                  sx={{
                    p: 0.5,
                    bgcolor: `${status.color}10`,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box sx={{ color: status.color }}>{status.icon}</Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {status.label}
                    </Typography>
                    <Typography variant="h6" fontWeight="medium" sx={{ color: status.color }}>
                      {status.value}
                    </Typography>
                  </Box>
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default StatusesCard;
