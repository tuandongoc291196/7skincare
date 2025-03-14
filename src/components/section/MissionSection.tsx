import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const MissionSection: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }} bgcolor={"#6C85A8"} color={"#ffffff"}>
      <Typography variant="h4" align="center" gutterBottom>
        Mong muốn đem lại giá trị cho cộng đồng làm đẹp
      </Typography>
      <Typography variant="body1" paragraph>
        Khi tham gia cùng 7skincare, bạn sẽ được đánh giá tình trạng da thông qua bộ câu hỏi trắc
        nghiệm được xây dựng từ những nguồn nghiên cứu khoa học chính thống (1), từ đó được định
        hướng liệu trình phù hợp riêng cho mình. Tuy nhiên bạn cũng có thể đăng ký tư vấn 1:1 với
        Personal Skin Trainer, cùng là các chuyên gia và bác sĩ da liễu của đội ngũ 7skincare, để
        đến tận phòng khám tại TP.HCM.
      </Typography>
      <Typography variant="body1" paragraph>
        7skincare chuyên tâm nghiên cứu và điều trị các trường hợp về da mụn, sẹo thâm do sau mụn,
        thâm nám, lão hóa, ... ở nhiều cấp độ và lứa tuổi với mong muốn mang đến làn da khỏe, sáng
        mịn cho từng khách hàng. Những dòng sản phẩm được 7skincare khuyên dùng trong các liệu trình
        điều trị chăm sóc da đều đến từ các thương hiệu nổi tiếng uy tín trên thế giới, và thành
        phần được nghiên cứu là an toàn và hiệu quả.
      </Typography>
      <Typography variant="body1" paragraph>
        7skincare cung cấp đầy đủ thông tin về liệu trình, sản phẩm cũng như các thành phần hoạt
        chất phổ biến để bạn có thể hiểu rõ hơn về những sản phẩm bạn đã, đang hoặc có ý định sử
        dụng.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <img
          src="/chemists.png"
          alt="Chemical structures"
          style={{ maxWidth: "100%", height: "auto", borderRadius: "24px" }}
        />
      </Box>
      <Typography variant="body1" paragraph>
        Bằng nỗ lực mang đến vẻ đẹp hoàn thiện cho làn da, đội ngũ Bác sĩ da liễu và chuyên viên tư
        vấn của 7skincare sẽ luôn có những hỗ trợ tốt nhất cho khách hàng trước nhu cầu tìm và giải
        quyết các vấn đề khác nhau.
      </Typography>
      <Typography variant="body1" paragraph>
        Luôn hoàn thiện mỗi ngày, 7skincare mong muốn trở thành một các bạn yêu thích làm đẹp có thể
        tâm bề mặt phương pháp điều trị chuẩn chuyên khoa, vừa được trải nghiệm dịch vụ chăm sóc tận
        tình, chu đáo.
      </Typography>
      <Paper sx={{ padding: 2, marginTop: 4 }}>
        <Typography variant="caption">
          (1) Tài liệu tham khảo cho bộ câu hỏi đánh giá tình trạng da:
          <br />
          1. Baumann, L. S., Penfield, R. D., Clark, J. L., & Duque, D. K. (2014). A validated
          questionnaire for quantifying skin oiliness. Journal of Cosmetics, Dermatological Sciences
          and Applications, 4(2), 124-130.
          <br />
          2. The Skin Type Solution by Leslie Baumann, MD, 2010
          <br />
          3. Hayashi, N., Akamatsu, H., Kawashima, M., & Acne Study Group. (2008). Establishment of
          grading criteria for acne severity. The Journal of dermatology, 35(5), 255-260.
          <br />
          4. Randja, C. A., Hynan, L. S., Bhora, R., Riley, F. C., Guevara, I. L., Grimes, P. E.,
          ... & Cfontana, J. P. (2011). Reliability assessment and validation of the Melasma Area
          and Severity Index (MASI) and a new modified MASI scoring method. International Journal of
          Dermatology, 50(1), 37-44.
          <br />
          5. Chandrashekar, B. S., Ashwini, K. R., Vasanth, V. K., & Nischal, K. (2015).
          Retinoid-acid and glycolic acid combination in the treatment of acne scars. Indian
          Dermatology Online Journal, 6(2), 92.
        </Typography>
      </Paper>
    </Box>
  );
};

export default MissionSection;
