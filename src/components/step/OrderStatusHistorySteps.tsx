import { OrderStatuses } from "@/constants/status";
import { OrderHistorySteps } from "@/types/schema/order";
import { Step, StepLabel, Stepper, Typography, Paper, Chip } from "@mui/material";
import { CheckCircleOutline, CancelOutlined, HourglassEmpty } from "@mui/icons-material";

interface OrderStatusHistoryStepsProps {
  steps: OrderHistorySteps[];
}

const OrderStatusHistorySteps = ({ steps }: OrderStatusHistoryStepsProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case OrderStatuses.PENDING:
        return {
          label: "Chờ xử lý",
          color: "warning",
          icon: <HourglassEmpty fontSize="small" />,
        };
      case OrderStatuses.APPROVED:
        return {
          label: "Đã chấp nhận",
          color: "info",
          icon: <CheckCircleOutline fontSize="small" />,
        };
      case OrderStatuses.DONE:
        return {
          label: "Giao hàng thành công",
          color: "success",
          icon: <CheckCircleOutline fontSize="small" />,
        };
      case OrderStatuses.SUCCESS:
        return {
          label: "Đã thanh toán",
          color: "success",
          icon: <CheckCircleOutline fontSize="small" />,
        };
      case OrderStatuses.CANCELED:
        return {
          label: "Thất bại",
          color: "error",
          icon: <CancelOutlined fontSize="small" />,
        };
      case OrderStatuses.REJECTED:
        return {
          label: "Bị từ chối",
          color: "error",
          icon: <CancelOutlined fontSize="small" />,
        };
      default:
        return {
          label: status,
          color: "default",
          icon: null,
        };
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        m: "auto",
        px: 10,
        py: 2,
        my: 4,
        borderRadius: 2,
      }}
    >
      <Stepper orientation="vertical">
        {steps.map(step => {
          const statusStyles = getStatusStyles(step.status);
          return (
            <Step key={step.id} active={true}>
              <StepLabel
                optional={
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {new Date(step.createAt).toLocaleString("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Typography>
                }
                StepIconComponent={() => (
                  <Chip
                    icon={statusStyles.icon || undefined}
                    label={statusStyles.label}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    color={statusStyles.color as any}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      fontWeight: "medium",
                    }}
                  />
                )}
              >
                <Typography variant="body1" sx={{ ml: 1, mt: 1 }}>
                  {step.description}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Paper>
  );
};

export default OrderStatusHistorySteps;
