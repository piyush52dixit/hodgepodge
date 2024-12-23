"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "antd";
import QuestionsCard from "./components/questionsCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [state, setState] = useState({
    loading: false,
    response: [],
    error: "",
  });

  const updateState = (updatedValues) => {
    setState((prevState) => ({ ...prevState, ...updatedValues }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        updateState({ loading: true });
        const response = await fetch("https://opentdb.com/api.php?amount=10");
        updateState({ loading: false });

        const data = await response.json();
        updateState({ response: data?.results });
      } catch (error) {
        console.error("Error fetching data:", error);
        updateState({ error });
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Quiz App</h1>
        {state.error ? <p>Oops, Something Went Wrong!</p> : null}
        <QuestionsCard data={state?.response} />
        <Button style={{ width: "50%", margin: "auto" }}>Let's go</Button>
      </main>
      <footer className={styles.footer}>
        <a href="https://github.com/piyush52dixit/" rel="noopener noreferrer">
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Github
        </a>
      </footer>
    </div>
  );
}
