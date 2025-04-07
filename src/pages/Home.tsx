import FeedbackBanner from "@/components/banner/FeedbackBanner";
import SkinTestBanner from "@/components/banner/SkinTestBanner";
import BenefitsSection from "@/components/section/BenefitsSection";
import HeroSection from "@/components/section/HeroSection";
import { Box, Container } from "@mui/material";

const Home = () => {
  return (
    <Container>
      <Box display={{ xs: "block", md: "flex" }} flexDirection={"column"} gap={10}>
        <HeroSection />
        <FeedbackBanner />
        <BenefitsSection />
        <SkinTestBanner />
      </Box>
    </Container>
  );
};

export default Home;
