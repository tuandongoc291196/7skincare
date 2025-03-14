import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import { feedbacks } from "@/constants/fakeData";

const FeedbackBanner: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const feedbackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (feedbackRef.current) {
      feedbackRef.current.style.transition = "transform 0.5s ease-in-out";
      feedbackRef.current.style.transform = `translateX(-${activeIndex * 100}%)`;
    }
  }, [activeIndex]);

  return (
    <Container>
      <Paper sx={{ padding: 4, textAlign: "center", overflow: "hidden" }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Khách hàng nói gì về chúng tôi
        </Typography>
        <Box mt={2} sx={{ display: "flex", overflow: "hidden", width: "100%" }}>
          <Box ref={feedbackRef} sx={{ display: "flex", width: `${feedbacks.length * 100}%` }}>
            {feedbacks.map((feedback, index) => (
              <Box key={index} sx={{ width: "100%", flexShrink: 0, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  {feedback.name}
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  “{feedback.text}”
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          {feedbacks.map((_, index) => (
            <Box
              key={index}
              sx={{
                height: 8,
                width: 8,
                backgroundColor: index === activeIndex ? "grey.800" : "grey.400",
                borderRadius: "50%",
                display: "inline-block",
                margin: 0.5,
                cursor: "pointer",
              }}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default FeedbackBanner;
