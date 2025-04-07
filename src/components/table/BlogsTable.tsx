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
import { Delete, Edit } from "@mui/icons-material";
import { Blog, BlogUpdate } from "@/types/schema/blog";
import { Statuses } from "@/constants/status";
import UpdateBlogDialog from "../dialog/UpdateBlogDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlog } from "@/apis/blog";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/hooks/useAlert";
import { AxiosError } from "axios";

interface BlogsTableProps {
  blogs: Blog[];
  page: number;
  setPage: (page: number) => void;
}

const BlogsTable: React.FC<BlogsTableProps> = ({ blogs, page, setPage }) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [blog, setBlog] = useState<BlogUpdate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const deleteBlogMutation = useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: (id: number) => deleteBlog(id),
    onSuccess: async () => {
      showAlert("Xóa bài đăng thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-blogs"] });
    },
    onError: (error: AxiosError) => {
      if (error?.status === 400 || error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Xóa bài đăng thất bại", "error");
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (blog: Blog) => {
    setBlog({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setBlog(null);
  };

  const handleInputChange = (field: keyof Blog, value: string) => {
    if (blog) {
      setBlog({ ...blog, [field]: value });
    }
  };
  const handleDeleteBlog = (id: number) => {
    deleteBlogMutation.mutate(id);
  };
  const paginatedBlogs = blogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Tác giả</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBlogs.map(blog => (
              <TableRow key={blog.id}>
                <TableCell width={"5%"}>{blog.id}</TableCell>
                <TableCell sx={{ width: 80, height: 80, overflow: "hidden" }}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", border: "1px solid grey", borderRadius: "5px" }}
                  />
                </TableCell>
                <TableCell width={"30%"}>{blog.title}</TableCell>
                <TableCell align="center" width={"15%"}>
                  {new Date(blog.createdAt).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={blog.status === Statuses.ACTIVATED ? "Hoạt động" : "Vô hiệu hóa"}
                    color={blog.status === Statuses.ACTIVATED ? "success" : "error"}
                  />
                </TableCell>
                <TableCell align="center" width={"10%"}>
                  {blog.authorName}
                </TableCell>
                <TableCell align="center" width={"10%"}>
                  <IconButton onClick={() => handleOpenDialog(blog)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteBlog(blog.id)}>
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
        count={blogs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <UpdateBlogDialog
        blog={blog}
        dialogOpen={dialogOpen}
        handleCloseDialog={handleCloseDialog}
        handleInputChange={handleInputChange}
      />
    </>
  );
};

export default BlogsTable;
