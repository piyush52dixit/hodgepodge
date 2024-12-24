"use client";

import React, { useState, useEffect } from "react";
import { Card, Radio, Alert, Button, Modal } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const QuestionsCard = (props) => {
  const [state, setState] = useState({
    choosedOption: "",
    isAnswerIncorrect: false,
    showAlert: false,
    isModalVisible: false,
    isResetModalVisible: false,
  });

  const [options, setOptions] = useState([]);

  const { data, handleNextQuestion, currentQuestionIndex, questions } =
    props || {};
  const { question, correct_answer, incorrect_answers, difficulty } =
    data || {};

  useEffect(() => {
    let shuffledOptions = [correct_answer, ...incorrect_answers];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [
        shuffledOptions[j],
        shuffledOptions[i],
      ];
    }
    setOptions(shuffledOptions);
  }, [correct_answer, incorrect_answers]);

  const handleChange = (e) => {
    const { value } = e?.target || {};
    setState((prev) => ({
      ...prev,
      choosedOption: value,
      showAlert: false,
      isAnswerIncorrect: false,
    }));
  };

  const handleAnswerCheck = () => {
    const isLastQuestion = currentQuestionIndex >= questions.length - 1;

    if (!state.choosedOption) {
      setState((prev) => ({ ...prev, showAlert: true }));
    } else if (state.choosedOption !== correct_answer) {
      setState((prev) => ({ ...prev, isAnswerIncorrect: true }));
    } else {
      if (isLastQuestion) {
        setState((prev) => ({ ...prev, isResetModalVisible: true }));
      } else {
        setState((prev) => ({ ...prev, isModalVisible: true }));
      }
      localStorage.setItem(
        "currentQuestionIndex",
        Number(currentQuestionIndex) + 1
      );
    }
  };

  const handleModalOk = () => {
    setState((prev) => ({ ...prev, isModalVisible: false }));
    handleNextQuestion();
  };

  const handleReset = () => {
    setState({
      choosedOption: "",
      isAnswerIncorrect: false,
      showAlert: false,
      isModalVisible: false,
      isResetModalVisible: false,
    });
    window.location.reload();
    localStorage.setItem("currentQuestionIndex", 0);
    handleNextQuestion(0);
    localStorage.removeItem("ques");
    localStorage.clear("isModalShown");
  };

  return (
    <>
      {state.showAlert && (
        <Alert message="Please Select an Option" type="error" />
      )}
      {state.isAnswerIncorrect && (
        <Alert message="You have Choosed Incorrect Option" type="error" />
      )}
      <Card
        title="Quiz Question"
        style={{
          width: 300,
        }}>
        <p>Difficulty: {difficulty}</p>
        <p dangerouslySetInnerHTML={{ __html: question }}></p>
        <Radio.Group onChange={handleChange}>
          {options.map((option, index) => (
            <Radio key={index} value={option}>
              <span dangerouslySetInnerHTML={{ __html: option }}></span>
            </Radio>
          ))}
        </Radio.Group>
      </Card>
      <Button
        color={state.isAnswerIncorrect && "danger"}
        variant="solid"
        style={{ width: "50%", margin: "auto" }}
        onClick={handleAnswerCheck}>
        Next
      </Button>

      <Modal
        visible={state.isModalVisible}
        footer={null}
        onCancel={() =>
          setState((prev) => ({ ...prev, isModalVisible: false }))
        }
        centered
        style={{ textAlign: "center" }}>
        <div style={{ padding: "20px", color: "green" }}>
          <SmileOutlined style={{ fontSize: "50px", color: "#52c41a" }} />
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You have selected the correct answer!</p>
          <Button
            type="primary"
            onClick={handleModalOk}
            style={{
              background: "linear-gradient(90deg, #52c41a, #73d13d)",
              border: "none",
            }}>
            Next Question
          </Button>
        </div>
      </Modal>

      <Modal
        visible={state.isResetModalVisible}
        footer={null}
        closable={false}
        onCancel={() =>
          setState((prev) => ({ ...prev, isResetModalVisible: false }))
        }
        centered
        style={{ textAlign: "center" }}>
        <div style={{ padding: "20px", color: "blue" }}>
          <h2>Quiz Complete!</h2>
          <p>Would you like to reset the quiz and start over?</p>
          <Button
            type="primary"
            onClick={handleReset}
            style={{
              background: "linear-gradient(90deg, #1890ff, #40a9ff)",
              border: "none",
            }}>
            Reset Quiz
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default QuestionsCard;
