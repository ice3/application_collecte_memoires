import React, { useState, useEffect } from "react";

import Question from "./question";
import { ToastContainer } from "react-toastify";

import { fetchQuestions } from "../../network_operations";

function RecordMemories({ shouldUseVideo, handleNextGlobalStep, memoryUUID }) {
  const [currentQuestionId, setQuestionStep] = useState(0);
  const [questionsOver, setQuestionsOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [key, setKey] = useState(currentQuestionId);

  useEffect(() => {
    fetchQuestions(setQuestions);
  }, []);

  const nextQuestion = () => {
    if (currentQuestionId < questionsNb - 1) {
      setQuestionStep(currentQuestionId + 1);
    }
    // currentQUestionId is not modified, we need to do strange stuff
    if (currentQuestionId == questionsNb - 2) {
      setQuestionsOver(true);
    }
    setKey(currentQuestionId + 1);
  };

  const invalidQuestion = () => {
    setKey((Math.random() + 1).toString(36).substring(7));
  };

  if (questions.length === 0) {
    return "";
  }

  const questionsNb = questions.length;
  const currentQuestion = questions[currentQuestionId];

  return (
    <div className="container">
      <ToastContainer autoClose={1500} hideProgressBar={false}></ToastContainer>

      <Question
        question={currentQuestion}
        shouldUseVideo={shouldUseVideo}
        step={currentQuestionId + 1}
        numberOfQuestions={questionsNb}
        handleNextQuestion={nextQuestion}
        invalidQuestion={invalidQuestion}
        key={key}
        memoryUUID={memoryUUID}
        questionsOver={questionsOver}
        handleNextGlobalStep={handleNextGlobalStep}
      />
    </div>
  );
}

export default RecordMemories;
