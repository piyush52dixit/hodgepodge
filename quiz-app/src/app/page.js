"use client";
import styles from "./page.module.css";
import QuestionsCard from "./components/questionsCard";
import { useEffect, useState } from "react";
import WelcomeModal from "./components/WelcomeModal";
import { Spin } from "antd";

export default function Home() {
  const [state, setState] = useState({
    loading: false,
    questions: [],
    error: "",
    currentQuestionIndex: 0,
  });

  const [isModalShown, setIsModalShown] = useState(false);

  const updateState = (updatedValues) => {
    setState((prevState) => ({ ...prevState, ...updatedValues }));
  };

  useEffect(() => {
    // Ensure the code only runs in the browser
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        try {
          updateState({ loading: true });
          const response = await fetch("https://opentdb.com/api.php?amount=10");
          const data = await response.json();
          updateState({ loading: false, questions: data?.results || [] });

          localStorage.setItem("ques", JSON.stringify(data?.results));
        } catch (error) {
          console.error("Error fetching data:", error);
          localStorage.removeItem("ques");
          updateState({ error: "Failed to fetch questions." });
        }
      };

      const dataExists = localStorage.getItem("ques");

      if (dataExists) {
        updateState({ questions: JSON.parse(dataExists) });
      } else {
        fetchData();
      }

      const currentQuestionIndex = localStorage.getItem("currentQuestionIndex");
      if (currentQuestionIndex) {
        updateState({ currentQuestionIndex: Number(currentQuestionIndex) });
      }

      // Handle modal visibility
      const modalVisibility = localStorage.getItem("isModalShown");
      if (modalVisibility) {
        setIsModalShown(true);
      }
    }
  }, []);

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      updateState({ currentQuestionIndex: state.currentQuestionIndex + 1 });
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!isModalShown && <WelcomeModal />}
        <div className={styles.mainWrapper}>
          <h1>Quiz App</h1>
          <span>
            {state.currentQuestionIndex + 1}/{state.questions?.length}
          </span>
        </div>

        {state.error ? <p>Oops, Something Went Wrong!</p> : null}

        {state.loading ? (
          <Spin />
        ) : (
          <>
            {state.questions.length > 0 &&
              state.questions[state.currentQuestionIndex] && (
                <QuestionsCard
                  data={state.questions[state.currentQuestionIndex]}
                  handleNextQuestion={handleNextQuestion}
                  currentQuestionIndex={state.currentQuestionIndex}
                  questions={state.questions}
                />
              )}
          </>
        )}
      </main>
    </div>
  );
}
