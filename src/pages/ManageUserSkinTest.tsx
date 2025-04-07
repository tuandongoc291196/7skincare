import { getUserTestByUserId } from "@/apis/skin-test";
import useAuthStore from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Typography, Box, Container } from "@mui/material";

import { useState } from "react";
import UserTestTable from "@/components/table/UserTestTable";
import LoadingSection from "@/components/section/LoadingSection";

const ManageUserSkinTest = () => {
  const { user } = useAuthStore.getState();
  const [page, setPage] = useState<number>(0);
  const { data, isLoading } = useQuery({
    queryKey: ["get-user-test-by-user-id"],
    queryFn: () => getUserTestByUserId(user?.accountId ?? 0),
    enabled: !!user?.accountId,
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Lịch sử kiểm tra loại da
      </Typography>
      <Box sx={{ width: "100%", mb: 4 }}>
        {isLoading ? (
          <LoadingSection />
        ) : (
          <UserTestTable data={data ?? []} page={page} setPage={setPage} />
        )}
      </Box>
    </Container>
  );
};

export default ManageUserSkinTest;
