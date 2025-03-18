import React, { useState } from "react";
import { Container } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQuestions } from "@/apis/question";
import useAuthStore from "@/hooks/useAuth";
import { SkinTestData } from "@/types/schema/skin-test";
import { createTest } from "@/apis/skin-test";
import { useAlert } from "@/hooks/useAlert";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSection from "@/components/section/LoadingSection";
import ResultSkinTestSection from "@/components/section/ResultSkinTestSection";
import SkinTestIntroSection from "@/components/section/SkinTestIntroSection";
import QuestionSection from "@/components/section/QuestionSection";

const SkinTest: React.FC = () => {
  const { showAlert } = useAlert();
  const { data, isLoading } = useQuery({ queryKey: ["get-questions"], queryFn: getQuestions });
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const testSkin = useMutation({
    mutationKey: ["create-test"],
    mutationFn: (data: SkinTestData) => createTest(data),
    onSuccess: () => alert("Bài kiểm tra đã được nộp thành công!"),
    onError: (error: AxiosError) => {
      if (error?.status === 403) {
        showAlert("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/dang-nhap");
      } else showAlert("Có lỗi xảy ra! Vui lòng thử lại.", "error");
    },
  });

  const handleStartQuiz = () => {
    if (user) setShowQuiz(true);
    else {
      showAlert("Vui lòng đăng nhập để tiếp tục", "error");
      navigate("/dang-nhap");
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const handleAnswerChange = (questionId: number, answerId: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmitQuiz = () => {
    const userTests = Object.entries(answers).map(([questionId, answerId]) => ({
      questionId: Number(questionId),
      answerId: Number(answerId),
    }));

    const payload: SkinTestData = {
      accountId: user?.accountId,
      userTests,
    };
    testSkin.mutate(payload);
  };

  if (isLoading) return <LoadingSection />;
  if (testSkin.isSuccess) return <ResultSkinTestSection />;

  const currentQuestion = data?.[currentQuestionIndex];

  return (
    <Container maxWidth="lg">
      {!showQuiz ? (
        <SkinTestIntroSection onStart={handleStartQuiz} />
      ) : (
        currentQuestion && (
          <QuestionSection
            question={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={data.length}
            selectedAnswer={answers[currentQuestion.id] || ""}
            onAnswerChange={handleAnswerChange}
            onNext={handleNextQuestion}
            onSubmit={handleSubmitQuiz}
            isLastQuestion={currentQuestionIndex === data.length - 1}
            isSubmitting={testSkin.isPending}
          />
        )
      )}
    </Container>
  );
};

export default SkinTest;
