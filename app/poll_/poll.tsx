"use client"
import React, { useState, useEffect } from "react";
import "./poll.css"
import { ConnectButton } from "@mysten/dapp-kit";


// Sui Wallet integration via injected window.sui
declare global {
  interface Window {
    sui?: any;
  }
}

type Poll = {
  id: string;
  owner: string;
  question: string;
  yes_votes: number;
  no_votes: number;
};

const PACKAGE_ID = "0xYourPollPackageId"; // <-- Replace with your Move package object ID
const MODULE = "poll_simple";

const PollSimpleApp: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selected, setSelected] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");

  // Connect wallet
  async function connectWallet() {
    setError(null);
    if (!window.sui) {
      setError("Sui Wallet extension not detected.");
      return;
    }
    try {
      const accounts = await window.sui.request({ method: "sui_getAccounts" });
      setAddress(accounts[0]);
    } catch (e: any) {
      setError("Wallet connection failed.");
    }
  }

  // Fetch polls (mocked, replace with real fetch)
  useEffect(() => {
    async function fetchPolls() {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with RPC or indexer call for shared Poll objects
        setPolls([
          { id: "0xPOL", owner: "0xOWN1", question: "Yes?", yes_votes: 0, no_votes: 0 },
        ]);
      } catch (e) {
        setError("Failed to fetch polls.");
      } finally {
        setLoading(false);
      }
    }
    fetchPolls();
  }, []);

  // Create a poll
  async function createPoll() {
    if (!question) {
      setError("Question required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Encode question as bytes (utf-8)
      const encoder = new TextEncoder();
      const questionBytes = Array.from(encoder.encode(question));
      const tx = {
        kind: "moveCall",
        data: {
          packageObjectId: PACKAGE_ID,
          module: MODULE,
          function: "create",
          typeArguments: [],
          arguments: [questionBytes],
          gasBudget: 10000,
        },
      };
      const result = await window.sui.request({
        method: "sui_signAndExecuteTransactionBlock",
        params: [tx, { requestType: "WaitForEffectsCert" }]
      });
      if (result.effects?.status.status === "success") {
        setError(null);
        setQuestion("");
        // Optionally refresh polls
      } else {
        setError("Poll creation failed.");
      }
    } catch (e: any) {
      setError("Poll creation error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  // Vote
  async function votePoll(voteYes: boolean) {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const tx = {
        kind: "moveCall",
        data: {
          packageObjectId: PACKAGE_ID,
          module: MODULE,
          function: "vote",
          typeArguments: [],
          arguments: [selected.id, voteYes],
          gasBudget: 10000,
        },
      };
      const result = await window.sui.request({
        method: "sui_signAndExecuteTransactionBlock",
        params: [tx, { requestType: "WaitForEffectsCert" }]
      });
      if (result.effects?.status.status === "success") {
        setError(null);
        // Optionally refresh polls/results
      } else {
        setError("Voting failed.");
      }
    } catch (e: any) {
      setError("Voting error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  // Reset poll (owner only)
  async function resetPoll() {
    if (!selected || !address) return;
    if (address.toLowerCase() !== selected.owner.toLowerCase()) {
      setError("Only the poll owner can reset results.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const tx = {
        kind: "moveCall",
        data: {
          packageObjectId: PACKAGE_ID,
          module: MODULE,
          function: "reset",
          typeArguments: [],
          arguments: [selected.id],
          gasBudget: 10000,
        },
      };
      const result = await window.sui.request({
        method: "sui_signAndExecuteTransactionBlock",
        params: [tx, { requestType: "WaitForEffectsCert" }]
      });
      if (result.effects?.status.status === "success") {
        setError(null);
        // Optionally refresh
      } else {
        setError("Reset failed.");
      }
    } catch (e: any) {
      setError("Reset error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ margin: "0 auto", padding: 32 }}>
      <h1>Create Poll</h1>
      <input
        type="text"
        value={question}
        placeholder="Enter poll question"
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "80%" }}
      />
      <button onClick={createPoll} disabled={loading} style={{ marginLeft: 8 }}>
        Create
      </button>

      <h2>Available Polls</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
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
          <button onClick={() => votePoll(true)} disabled={loading}>
            Vote Yes
          </button>
          <button onClick={() => votePoll(false)} disabled={loading} style={{ marginLeft: 8 }}>
            Vote No
          </button>
          {address?.toLowerCase() === selected.owner.toLowerCase() && (
            <div style={{ marginTop: 16 }}>
              <button onClick={resetPoll} disabled={loading}>
                Reset Results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollSimpleApp;