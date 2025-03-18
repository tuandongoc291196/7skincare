import { useState } from "react";
import { Container, Typography, Button, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingSection from "@/components/section/LoadingSection";
import { getQuestions } from "@/apis/question";
import QuestionsTable from "@/components/table/QuestionsTable";
import AddQuestionDialog from "@/components/dialog/AddQuestionDialog";

const ManageQuestions = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["get-questions"],
    queryFn: () => getQuestions(),
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredData = data?.filter(question =>
    question.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container sx={{ marginTop: "20px" }}>
      <Box display={"flex"} justifyContent={"space-between"} sx={{ marginBottom: "10px" }}>
        <Typography variant="h5" gutterBottom>
          Danh sách câu hỏi
        </Typography>
        <Box display={"flex"} gap={2}>
          <TextField
            label="Tìm kiếm câu hỏi"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Thêm câu hỏi
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <QuestionsTable questions={filteredData ?? []} page={page} setPage={setPage} />
      )}
      <AddQuestionDialog onClose={handleClose} open={open} />
    </Container>
  );
};

export default ManageQuestions;
