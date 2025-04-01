import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { QuestionCreate } from "@/types/schema/question";
import { createQuestion } from "@/apis/question";

interface AddQuestionDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddQuestionDialog: React.FC<AddQuestionDialogProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<Array<{ answer: string; point: number }>>([
    { answer: "", point: 0 },
  ]);
  const [errors, setErrors] = useState<{ question?: string; answers?: string[] }>({});

  const mutation = useMutation({
    mutationKey: ["create-question"],
    mutationFn: (newQuestion: QuestionCreate) => createQuestion(newQuestion),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-questions"],
      });
      onClose();
    },
  });

  const handleAddAnswer = () => {
    setAnswers([...answers, { answer: "", point: 0 }]);
  };

  const handleRemoveAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (index: number, field: "answer" | "point", value: string | number) => {
    const newAnswers = [...answers];
    newAnswers[index] = {
      ...newAnswers[index],
      [field]: value,
    };
    setAnswers(newAnswers);
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

  const handleSubmit = () => {
    if (validate()) {
      mutation.mutate({ question, answers });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm câu hỏi</DialogTitle>
      <DialogContent style={{ padding: "16px", width: "600px" }}>
        <TextField
          autoFocus
          margin="dense"
          label="Câu hỏi"
          type="text"
          fullWidth
          value={question}
          onChange={e => setQuestion(e.target.value)}
          error={!!errors.question}
          helperText={errors.question}
        />
        {answers.map((answer, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <TextField
              multiline
              minRows={1}
              margin="dense"
              label={`Câu trả lời ${index + 1}`}
              type="text"
              fullWidth
              value={answer.answer}
              onChange={e => handleAnswerChange(index, "answer", e.target.value)}
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
              error={!!errors.answers?.[index] && errors.answers[index] === "0 đến 10"}
              helperText={errors.answers?.[index] === "0 đến 10" ? errors.answers[index] : ""}
            />
            <IconButton onClick={() => handleRemoveAnswer(index)} disabled={answers.length === 1}>
              <RemoveIcon />
            </IconButton>
          </div>
        ))}
        <Button onClick={handleAddAnswer} startIcon={<AddIcon />} style={{ marginTop: 16 }}>
          Thêm câu trả lời
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuestionDialog;
