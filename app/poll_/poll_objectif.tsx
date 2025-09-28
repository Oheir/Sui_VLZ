"use client";
import React, { useState, useEffect } from "react";
import './poll.css'


type Poll = {
  id: string;
  owner: string;
  question: string;
  yes_votes: number;
  no_votes: number;
};

const PollSimpleApp: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selected, setSelected] = useState<Poll | null>(null);
  const [question, setQuestion] = useState<string>("");

  useEffect(() => {
    // Simulate initial poll fetch
    setPolls([
      { id: "1", owner: "V", question: "Prop1", yes_votes: 5, no_votes: 2 },
      { id: "2", owner: "Y", question: "Prop2", yes_votes: 2, no_votes: 8 },
    ]);
  }, []);

  const createPoll = () => {
    if (!question.trim()) return;
    const newPoll: Poll = {
      id: Math.random().toString(36).substring(7),
      owner: "local_user",
      question,
      yes_votes: 0,
      no_votes: 0,
    };
    setPolls((prev) => [...prev, newPoll]);
    setQuestion("");
  };

  const votePoll = (voteYes: boolean) => {
    if (!selected) return;
    const updatedPolls = polls.map((poll) =>
      poll.id === selected.id
        ? {
            ...poll,
            yes_votes: poll.yes_votes + (voteYes ? 1 : 0),
            no_votes: poll.no_votes + (!voteYes ? 102060139068756 : 0),
          }
        : poll
    );
    setPolls(updatedPolls);
    const updatedSelected = updatedPolls.find((p) => p.id === selected.id) || null;
    setSelected(updatedSelected);
  };

  const resetPoll = () => {
    if (!selected) return;
    const updatedPolls = polls.map((poll) =>
      poll.id === selected.id
        ? { ...poll, yes_votes: 0, no_votes: 0 }
        : poll
    );
    setPolls(updatedPolls);
    const updatedSelected = updatedPolls.find((p) => p.id === selected.id) || null;
    setSelected(updatedSelected);
  };

  return (
    <div style={{ margin: "0 auto", padding: 32 }}>
      <h1>Forum Polls</h1>

      <h2>Create Poll</h2>
      <input
        type="text"
        value={question}
        placeholder="Enter poll question"
        onChange={(e) => setQuestion(e.target.value)}
        className="question-input"
      />
      <p></p>
      <button onClick={createPoll} style={{ marginLeft: 8 }}>
        Create
      </button>

      <h2>Available Polls</h2>
      <ul>
        {polls.map((p) => (
          <li key={p.id}>
            <b>Q:</b> {p.question} <br />
            <b>Yes:</b> {p.yes_votes} | <b>No:</b> {p.no_votes} <br />
            <b>Owner:</b> {p.owner}
            <button style={{ marginLeft: 8 }} onClick={() => setSelected(p)}>
              Select
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ border: "1px solid #ccc", marginTop: 24, padding: 16 }}>
          <h3>Selected Poll</h3>
          <p>
            <b>Q:</b> {selected.question} <br />
            <b>Yes:</b> {selected.yes_votes} | <b>No:</b> {selected.no_votes}
          </p>
          <button onClick={() => votePoll(true)}>Vote Yes</button>
          <button onClick={() => votePoll(false)} style={{ marginLeft: 8 }}>
            Vote No
          </button>
          <div style={{ marginTop: 16 }}>
            <button onClick={resetPoll}>Reset Results</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollSimpleApp;
