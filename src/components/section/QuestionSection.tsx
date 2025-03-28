import {
  Box,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

interface QuestionSectionProps {
  question: {
    id: number;
    question: string;
    listAnswers: { id: number; answer: string }[];
  };
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string;
  onAnswerChange: (questionId: number, answerId: string) => void;
  onNext: () => void;
  onSubmit: () => void;
  isLastQuestion: boolean;
  isSubmitting: boolean;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
  onNext,
  onSubmit,
  isLastQuestion,
  isSubmitting,
}) => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        XÁC ĐỊNH LOẠI DA CỦA BẠN
      </Typography>
      <Box key={question.id} sx={{ mb: 4 }}>
        <Typography variant="h6">
          Câu hỏi {currentIndex + 1} of {totalQuestions}
        </Typography>
        <Typography variant="h6">{question.question}</Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={selectedAnswer}
            onChange={e => onAnswerChange(question.id, e.target.value)}
          >
            {question.listAnswers.map(answer => (
              <FormControlLabel
                key={answer.id}
                value={answer.id}
                control={<Radio />}
                label={answer.answer}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      {!isLastQuestion ? (
        <Button variant="contained" sx={{ mt: 2 }} onClick={onNext} disabled={!selectedAnswer}>
          TỚI CÂU TIẾP THEO
        </Button>
      ) : (
        <Button variant="contained" sx={{ mt: 2 }} onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Đang nộp..." : "NỘP BÀI"}
        </Button>
      )}
    </Box>
  );
};

export default QuestionSection;
