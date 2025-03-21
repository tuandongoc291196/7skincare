import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlog } from "@/apis/blog";
import { useAlert } from "@/hooks/useAlert";
import { BlogUpdate } from "@/types/schema/blog";
import { storage } from "@/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Image } from "@mui/icons-material";

interface UpdateBlogDialogProps {
  blog: BlogUpdate | null;
  dialogOpen: boolean;
  handleCloseDialog: () => void;
  handleInputChange: (field: keyof BlogUpdate, value: string) => void;
}

const UpdateBlogDialog: React.FC<UpdateBlogDialogProps> = ({
  blog,
  dialogOpen,
  handleCloseDialog,
  handleInputChange,
}) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateBlogMutation = useMutation({
    mutationKey: ["update-blog"],
    mutationFn: (data: BlogUpdate) => updateBlog(data),
    onSuccess: async () => {
      showAlert("Cập nhật blog thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-blogs"] });
      handleCloseDialog();
    },
    onError: () => {
      showAlert("Cập nhật blog thất bại", "error");
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!blog?.title) newErrors.title = "Tiêu đề không được để trống";
    if (!blog?.content) newErrors.content = "Nội dung không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateFields() || !blog) return;
    let imageUrl = blog.image;
    if (selectedFile) {
      const storageRef = ref(storage, `images/${selectedFile.name}`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    updateBlogMutation.mutate({ ...blog, image: imageUrl });
  };

  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>Cập nhật Blog</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={4} alignContent={"center"}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Box
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: 2,
                  height: "100%",
                  border: errors.image ? "1px solid red" : "1px solid grey",
                  overflow: "hidden",
                  alignContent: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {blog?.image ? (
                  <img
                    src={blog.image}
                    alt="New Blog"
                    style={{ width: "100%", display: "block" }}
                  />
                ) : (
                  <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={1}>
                    <Image color="action" sx={{ height: 50, width: 50 }} />
                    <Typography fontWeight={500} color="textSecondary">
                      Chọn hình ảnh
                    </Typography>
                  </Box>
                )}
              </Box>
            </label>
            {errors.image && (
              <Typography color="error" variant="caption">
                {errors.image}
              </Typography>
            )}
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Tiêu đề"
              name="title"
              value={blog?.title || ""}
              onChange={e => handleInputChange("title", e.target.value)}
              margin="dense"
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              fullWidth
              label="Nội dung"
              name="content"
              value={blog?.content || ""}
              onChange={e => handleInputChange("content", e.target.value)}
              margin="dense"
              multiline
              minRows={4}
              maxRows={6}
              error={!!errors.content}
              helperText={errors.content}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary" variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleUpdate} color="primary" variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBlogDialog;
