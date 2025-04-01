import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { QuestionUpdate } from "@/types/schema/question";

interface EditQuestionDialogProps {
  open: boolean;
  handleClose: () => void;
  questionData: QuestionUpdate;
  updateQuestion: (data: QuestionUpdate) => void;
}

const EditQuestionDialog: React.FC<EditQuestionDialogProps> = ({
  open,
  handleClose,
  questionData,
  updateQuestion,
}) => {
  const [question, setQuestion] = useState<string>(questionData.question);
  const [answers, setAnswers] = useState(questionData.answers);
  const [errors, setErrors] = useState<{ question?: string; answers?: string[] }>({});

  const handleAnswerChange = (index: number, field: "answer" | "point", value: string | number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      [field]: value,
    };
    setAnswers(updatedAnswers);
  };

  const validate = () => {
    const newErrors: { question?: string; answers?: string[] } = {};
    if (!question.trim()) {
      newErrors.question = "Câu hỏi không được để trống";
    }
    const answerErrors = answers.map(answer => {
      if (!answer.answer.trim()) {
        return "Câu trả lời không được để trống";
      }
      if (answer.point < 0 || answer.point > 10) {
        return "1 đến 10";
      }
      return null;
    });
    if (answerErrors.some(error => error !== null)) {
      newErrors.answers = answerErrors.filter(error => error !== null) as string[];
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      updateQuestion({ id: questionData.id, question, answers });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
      <DialogContent style={{ padding: "16px", width: "600px" }}>
        <TextField
          fullWidth
          label="Câu hỏi"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          margin="dense"
          error={!!errors.question}
          helperText={errors.question}
        />
        {answers.map((answer, index) => (
          <div key={answer.id} style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <TextField
              fullWidth
              label={`Câu trả lời ${index + 1}`}
              value={answer.answer}
              onChange={e => handleAnswerChange(index, "answer", e.target.value)}
              margin="dense"
              error={
                !!errors.answers?.[index] &&
                errors.answers[index] === "Câu trả lời không được để trống"
              }
              helperText={
                errors.answers?.[index] === "Câu trả lời không được để trống"
                  ? errors.answers[index]
                  : ""
              }
            />
            <TextField
              margin="dense"
              label="Điểm"
              type="number"
              value={answer.point}
              onChange={e => handleAnswerChange(index, "point", parseInt(e.target.value))}
              style={{ width: 80, marginLeft: 8 }}
              inputProps={{ min: 0, max: 2 }}
              error={!!errors.answers?.[index] && errors.answers[index] === "1 đến 10"}
              helperText={errors.answers?.[index] === "1 đến 10" ? errors.answers[index] : ""}
            />
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} startIcon={<Cancel />} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSave} startIcon={<Save />} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditQuestionDialog;
