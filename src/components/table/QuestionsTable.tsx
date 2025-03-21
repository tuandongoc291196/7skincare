import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Question, Answer, QuestionUpdate } from "@/types/schema/question";
import AnswerDialog from "../dialog/AnswerDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuestion, updateQuestion } from "@/apis/question";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import EditQuestionDialog from "../dialog/EditQuestionDialog";

interface QuestionsTableProps {
  questions: Question[];
  page: number;
  setPage: (page: number) => void;
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({ questions, page, setPage }) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionUpdate | null>(null);

  const updateQuestionMutation = useMutation({
    mutationKey: ["update-question"],
    mutationFn: (data: QuestionUpdate) => updateQuestion(data),
    onSuccess: async () => {
      showAlert("Cập nhật câu hỏi thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-questions"] });
      setEditDialogOpen(false);
    },
    onError: (error: AxiosError) => {
      if (error?.status === 400 || error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Cập nhật câu hỏi thất bại", "error");
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationKey: ["delete-question"],
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: async () => {
      showAlert("Xóa câu hỏi thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-questions"] });
    },
    onError: (error: AxiosError) => {
      if (error?.status === 400 || error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Xóa câu hỏi thất bại", "error");
    },
  });
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (answers: Answer[]) => {
    setSelectedAnswers(answers);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedAnswers([]);
  };
  const handleDeleteQuestion = (id: number) => {
    deleteQuestionMutation.mutate(id);
  };
  const handleOpenEditDialog = (question: Question) => {
    setSelectedQuestion({
      id: question.id,
      question: question.question,
      answers: question.listAnswers.map(answer => ({
        id: answer.id,
        answer: answer.answer,
        point: answer.point,
      })),
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedQuestion(null);
  };

  const paginated = questions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Câu hỏi</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Số lượng câu trả lời</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Xem câu trả lời</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(question => (
              <TableRow key={question.id}>
                <TableCell>{question.id}</TableCell>
                <TableCell>{question.question}</TableCell>
                <TableCell align="center">
                  {new Date(question.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell align="center">{question.listAnswers.length}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={question.status === "ACTIVATED" ? "Hoạt động" : "Vô hiệu hóa"}
                    color={question.status === "ACTIVATED" ? "success" : "error"}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(question.listAnswers)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenEditDialog(question)}>
                    <Edit sx={{ color: "blue" }} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={questions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* Dialog for displaying answers */}
      <AnswerDialog
        open={open}
        handleCloseDialog={handleCloseDialog}
        selectedAnswers={selectedAnswers}
      />
      {/* Dialog for editing questions */}
      {selectedQuestion && (
        <EditQuestionDialog
          open={editDialogOpen}
          handleClose={handleCloseEditDialog}
          questionData={selectedQuestion}
          updateQuestion={updateQuestionMutation.mutate}
        />
      )}
    </>
  );
};

export default QuestionsTable;
