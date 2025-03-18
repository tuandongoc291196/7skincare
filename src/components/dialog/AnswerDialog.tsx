import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { Answer } from "@/types/schema/question";

interface AnswerDialogProps {
  open: boolean;
  handleCloseDialog: () => void;
  selectedAnswers: Answer[];
}

const AnswerDialog: React.FC<AnswerDialogProps> = ({
  open,
  handleCloseDialog,
  selectedAnswers,
}) => {
  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
      <DialogTitle>Câu trả lời</DialogTitle>
      <DialogContent>
        <List>
          {selectedAnswers.map(answer => (
            <ListItem
              key={answer.id}
              sx={{
                border: "solid 1px gray",
                borderRadius: "12px",
                marginBottom: "8px",
                padding: "16px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <ListItemText
                primary={answer.answer}
                secondary={`Điểm: ${answer.point} - Ngày tạo: ${new Date(answer.createdAt).toLocaleDateString("vi-VN")}`}
              />
            </ListItem>
          ))}
        </List>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={handleCloseDialog} variant="contained">
            Đóng
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerDialog;
