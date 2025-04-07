import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUserTestById } from "@/apis/skin-test";
import ResultSkinTestSection from "../section/ResultSkinTestSection";
import LoadingSection from "../section/LoadingSection";

interface AddPositionDialogProps {
  open: boolean;
  handleClose: () => void;
  id: number;
}

const UserTestDetailDialog: React.FC<AddPositionDialogProps> = ({ open, handleClose, id }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-user-test-by-id"],
    queryFn: () => getUserTestById(id),
    enabled: !!id,
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Chi tiết kiểm tra loại da</DialogTitle>
      <DialogContent>
        {isLoading ? <LoadingSection /> : data && <ResultSkinTestSection result={data} isHistory />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info" variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserTestDetailDialog;
