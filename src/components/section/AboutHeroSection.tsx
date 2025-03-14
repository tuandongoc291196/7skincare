import { Avatar, Box, Container, Typography } from "@mui/material";

const AboutHeroSection = () => {
  return (
    <Container>
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          Giới thiệu về 7skincare
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <Box
            component="img"
            src="/doctor.jpg"
            alt="Doctor"
            sx={{
              width: { xs: "100%", sm: "500px" },
              borderRadius: "8px",
            }}
          />

          <Box sx={{ textAlign: "left", maxWidth: "500px" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#212A6B", mb: 2 }}>
              7skincare
            </Typography>
            <Typography variant="body1">
              Là một dự án của <b>Hi Beauty</b> cùng đội ngũ các bác sĩ Da liễu, sự lựa chọn hàng
              đầu cho bạn khi có nhu cầu tư vấn và điều trị các vấn đề về da.
            </Typography>
          </Box>
        </Box>
      </Container>{" "}
      <Typography variant="h5" sx={{ mb: 2, mt: 10 }}>
        Đôi nét về Hi beauty
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }} textAlign={"justify"}>
        <strong>Hi Beauty</strong> - Nhà phân phối các sản phẩm chính hãng từ những thương hiệu đình
        đám. Hi Beauty là thương hiệu thuộc Công ty TNHH Thương Mại Chidori, đơn vị chuyên nhập khẩu
        phân phối các sản phẩm chăm sóc da từ những thương hiệu nổi tiếng hàng đầu thế giới. Trải
        qua nhiều năm hoạt động, Hi Beauty là địa chỉ cung cấp mỹ phẩm làm đẹp, chăm sóc da uy tín
        của đông đảo các tín đồ làm đẹp trong và ngoài nước.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }} textAlign={"justify"}>
        Trong đó phải kể đến một số hãng mỹ phẩm đình đám như: Murad, Vi Derm, Revitalash,
        Martiderm, Foreo, Obagi, Paula's Choice, Image Skincare, Heliocare, Dermaceutic,
        Dermalogica, SkinCeuticals, Elta MD, Neova, Neocutis, Exuviance,... cùng hàng trăm thương
        hiệu tên tuổi khác.
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Bác sĩ Anh Trung LÀ AI
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Avatar alt="Doctor" src="/doctor.jpg" sx={{ width: 100, height: 100, mr: 2 }} />
        <Typography variant="body1" textAlign={"justify"}>
          Bác sĩ Anh Trung Chuyên khoa Da Liễu - Thẩm mỹ Nội khoa; đạt được nhiều chứng chỉ về
          chuyên khoa Da liễu và Thẩm mỹ nội khoa (botox, filler, căng chỉ...) tại trường Y dược
          TPHCM và bệnh viện Da liễu. Bác sĩ Trung có nhiều năm kinh công tác tại nhiều phòng thẩm
          mỹ, clinic uy tín lâu năm như Thẩm mỹ viện KangJin, Koreas, Clair Clinic, HD korea clinic,
          Viện trẻ hóa 4.0, thẩm mỹ viện quốc tế, thẩm mỹ da và trẻ hóa,... với các thế mạnh như:
          điều trị các vấn đề về da, thẩm mỹ da công nghệ cao, trẻ hóa da, điều trị nám, tàn nhang,
          mụn, sẹo rỗ, chăm sóc da công nghệ cao trong thẩm mỹ.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutHeroSection;
