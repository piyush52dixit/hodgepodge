"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";

const WelcomeModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOk = () => {
    setIsModalOpen(false);
    localStorage.setItem("isModalShown", true);
  };
  const quizPoints = [
    {
      heading: "🎯 Test Your Knowledge",
      description:
        "Challenge yourself with quizzes in various categories like Science, History, and Technology.",
    },
    {
      heading: "📊 Track Your Progress",
      description:
        "Keep an eye on your scores and performance over time to measure your improvement.",
    },
    {
      heading: "⏳ Timed Challenges",
      description:
        "Answer questions within a time limit to add an exciting challenge to your quiz experience.",
    },
  ];

  return (
    <>
      <Modal
        title="Welcome To the Quiz App!"
        open={isModalOpen}
        onOk={handleOk}
        okText="Start Quiz"
        closable={false}
        footer={
          <div style={{ textAlign: "center" }}>
            <Button type="primary" onClick={handleOk}>
              Start Quiz
            </Button>
          </div>
        }
        cancelButtonProps={{ style: { display: "none" } }}>
        {quizPoints.map((point, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <h4 style={{ margin: "0 0 8px" }}>{point.heading}</h4>
            <p style={{ margin: 0 }}>{point.description}</p>
          </div>
        ))}
      </Modal>
    </>
  );
};

export default WelcomeModal;
