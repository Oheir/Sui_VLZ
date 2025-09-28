"use client";
import React, { useState, useEffect } from "react";
import "./forum.css";

type Forum = {
  id: string;
  name: string;
  description: string;
  creator: string;
  member_count: number;
  active_poll?: string | null;
  created_at: number;
};

const ForumApp: React.FC = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [selected, setSelected] = useState<Forum | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial mock forums
    setForums([
      {
        id: "forum1",
        name: "Tech Talk",
        description: "Discuss all things tech",
        creator: "user1",
        member_count: 12,
        active_poll: null,
        created_at: Date.now(),
      },
    ]);
  }, []);
 
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);

  function createForum() {
    if (!name || !creator || !password) {
      setError("All fields are required.");
      return;
    }

    const newForum: Forum = {
      id: `forum${Date.now()}`,
      name,
      description,
      creator,
      member_count: 1,
      active_poll: null,
      created_at: Date.now(),
    };

    setForums((prev) => [...prev, newForum]);
    setName("");
    setDescription("");
    setCreator("");
    setPassword("");
    setError(null);
  }

  return (
    <div className="container">
      <h1>Shallot Forums </h1>

      <h2>Create Forum</h2>
      <input
        type="text"
        value={name}
        placeholder="Forum Name"
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <input
        type="text"
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
        className="input"
      />
      <input
        type="text"
        value={creator}
        placeholder="Creator Name"
        onChange={(e) => setCreator(e.target.value)}
        className="input"
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <button onClick={createForum}>Create Forum</button>
      {error && <p className="error">{error}</p>}

      <h2>Available Forums</h2>
      <ul>
        {forums.map((f) => (
          <li key={f.id}>
            <b>{f.name}</b> <br />
            {f.description}
            <br />
            <b>Creator:</b> {f.creator}
            <br />
            <button onClick={() => setSelected(f)} style={{ marginTop: "0.5rem" }}>
              Select
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="selected">
          <h3>Selected Forum</h3>
          <p>
            <b>Name:</b> {selected.name} <br />
            <b>Description:</b> {selected.description} <br />
            <b>Creator:</b> {selected.creator} <br />
            <b>Members:</b> {selected.member_count} <br />
            <b>Created:</b> {new Date(selected.created_at).toLocaleString()}
          </p>
          <button onClick={() => setSelectedForum('./poll/poll.tsx')}>Go to Forum</button>
        </div>
      )}
    </div>
  );
};

export default ForumApp;
