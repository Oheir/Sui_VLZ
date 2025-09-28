"use client"
import React, { useEffect, useState } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import "./forum.css"

// Minimal Sui Wallet integration via injected window.sui
declare global {
  interface Window {
    sui?: any;
  }
}

type Forum = {
  id: string;
  name: string;
  description: string;
  creator: string;
  member_count: number;
  active_poll?: string | null;
  created_at: number;
};

const PACKAGE_ID = "0xYourForumPackageId"; // <-- Replace with your Move package object ID
const MODULE = "forum";

const ForumApp: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [forums, setForums] = useState<Forum[]>([]);
  const [selected, setSelected] = useState<Forum | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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

  // Fetch forums (mocked, replace with RPC/indexer for real data)
  useEffect(() => {
    async function fetchForums() {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with Sui RPC/indexer call for shared Forum objects
        setForums([
          {
            id: "0xFORUM1",
            name: "Privacy Community",
            description: "Discuss privacy proposals",
            creator: "0xOWNER1",
            member_count: 10,
            active_poll: "0xPOLL1",
            created_at: Date.now() - 86400000,
          },
          {
            id: "0xFORUM2",
            name: "Tech Governance",
            description: "Tech policy debates",
            creator: "0xOWNER2",
            member_count: 16,
            active_poll: null,
            created_at: Date.now() - 604800000,
          },
        ]);
      } catch (e) {
        setError("Failed to fetch forums.");
      } finally {
        setLoading(false);
      }
    }
    fetchForums();
  }, []);

  // Create a forum
  async function createForum() {
    if (!name) {
      setError("Name required.");
      return;
    }
    if (!password) {
      setError("Password required.");
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
          function: "create_forum",
          typeArguments: [],
          arguments: [name, description, password, "0xCLOCK_OBJECT"], // Replace with real Clock object or logic
          gasBudget: 10000,
        },
      };
      const result = await window.sui.request({
        method: "sui_signAndExecuteTransactionBlock",
        params: [tx, { requestType: "WaitForEffectsCert" }],
      });
      if (result.effects?.status.status === "success") {
        setError(null);
        setName("");
        setDescription("");
        setPassword("");
        // Optionally refresh forums from chain/indexer
      } else {
        setError("Forum creation failed.");
      }
    } catch (e: any) {
      setError("Forum creation error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 32 }}>
      <h1>Shallot Forums</h1>
      {!address ? (
        <ConnectButton/>
      ) : (
        <div>
          Connected: <b>{address}</b>
        </div>
      )}

      <h2>Create Forum</h2>
      <input
        type="text"
        value={name}
        placeholder="Forum Name"
        onChange={(e) => setName(e.target.value)}
        style={{ width: "80%" }}
      />
      <input
        type="text"
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "80%", marginTop: 4 }}
      />
      <input
        type="password"
        value={password}
        placeholder="Forum Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "80%", marginTop: 4 }}
      />
      <button onClick={createForum} disabled={loading} style={{ marginLeft: 8 }}>
        Create
      </button>

      <h2>Available Forums</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {forums.map((f) => (
          <li key={f.id}>
            <b>{f.name}</b> <br />
            {f.description}
            <br />
            <b>Creator:</b> {f.creator} <br />
            <b>Members:</b> {f.member_count} <br />
            <b>Active Poll:</b>{" "}
            {f.active_poll ? f.active_poll : <span>None</span>}
            <br />
            <button style={{ marginTop: 8 }} onClick={() => setSelected(f)}>
              Select
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div style={{ border: "1px solid #ccc", marginTop: 24, padding: 16 }}>
          <h3>Selected Forum</h3>
          <p>
            <b>Name:</b> {selected.name} <br />
            <b>Description:</b> {selected.description}
            <br />
            <b>Creator:</b> {selected.creator} <br />
            <b>Members:</b> {selected.member_count} <br />
            <b>Active Poll:</b>{" "}
            {selected.active_poll ? selected.active_poll : <span>None</span>}
            <br />
            <b>Created At:</b> {new Date(selected.created_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ForumApp;