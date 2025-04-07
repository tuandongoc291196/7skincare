import BenefitBanner from "@/components/banner/WhyJoinUsBanner";
import AboutHeroSection from "@/components/section/AboutHeroSection";
import MissionSection from "@/components/section/MissionSection";
import { Box, Container } from "@mui/material";

const About = () => {
  return (
    <Container>
      <Box display={{ xs: "block", md: "flex" }} flexDirection={"column"} gap={5}>
        <AboutHeroSection />
        <MissionSection />
        <BenefitBanner />
      </Box>
    </Container>
  );
};

export default About;
