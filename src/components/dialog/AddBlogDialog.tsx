import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createBlog } from "@/apis/blog";
import { useAlert } from "@/hooks/useAlert";
import useAuthStore from "@/hooks/useAuth";
import { BlogCreate } from "@/types/schema/blog";
import { Image } from "@mui/icons-material";

interface AddBlogDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AddBlogDialog: React.FC<AddBlogDialogProps> = ({ open, handleClose }) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newBlog, setNewBlog] = useState<BlogCreate>({
    accountId: user?.accountId as number,
    title: "",
    content: "",
    image: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setErrors({});
  }, [open]);

  const createBlogMutation = useMutation({
    mutationKey: ["create-blog"],
    mutationFn: (data: BlogCreate) => createBlog(data),
    onSuccess: async () => {
      showAlert("Thêm blog mới thành công", "success");
      await queryClient.invalidateQueries({ queryKey: ["get-blogs"] });
      resetForm();
      handleClose();
    },
    onError: () => {
      showAlert("Thêm blog mới thất bại", "error");
    },
  });

  const resetForm = () => {
    setNewBlog({
      accountId: user?.accountId as number,
      title: "",
      content: "",
      image: "",
    });
    setSelectedFile(null);
    setErrors({});
  };

  const handleChange = (event: { target: { name: string; value: string } }) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBlog({ ...newBlog, image: reader.result as string });
        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newBlog.title) newErrors.title = "Tiêu đề không được để trống";
    if (!newBlog.content) newErrors.content = "Nội dung không được để trống";
    if (!newBlog.image) newErrors.image = "Vui lòng chọn hình ảnh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validateFields()) {
      if (selectedFile) {
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        if (downloadURL) {
          createBlogMutation.mutate({ ...newBlog, image: downloadURL });
        }
      } else {
        createBlogMutation.mutate(newBlog);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography fontSize={20} fontWeight={600}>
          Thêm Blog Mới
        </Typography>
      </DialogTitle>
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
                {newBlog.image ? (
                  <img
                    src={newBlog.image}
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
              value={newBlog.title}
              onChange={handleChange}
              margin="dense"
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              fullWidth
              label="Nội dung"
              name="content"
              value={newBlog.content}
              onChange={handleChange}
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
        <Button
          onClick={() => {
            resetForm();
            handleClose();
          }}
          color="primary"
          variant="outlined"
        >
          Đóng
        </Button>
        <Button
          onClick={handleCreate}
          color="primary"
          variant="contained"
          disabled={createBlogMutation.isPending}
        >
          Tạo mới
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBlogDialog;
