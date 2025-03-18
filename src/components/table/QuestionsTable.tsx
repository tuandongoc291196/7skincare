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
import { Visibility } from "@mui/icons-material";
import { Question, Answer } from "@/types/schema/question";
import AnswerDialog from "../dialog/AnswerDialog";

interface QuestionsTableProps {
  questions: Question[];
  page: number;
  setPage: (page: number) => void;
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({ questions, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);

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
              <TableCell align="center">Số lượng câu trả lời</TableCell>{" "}
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Xem câu trả lời</TableCell>
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
    </>
  );
};

export default QuestionsTable;
