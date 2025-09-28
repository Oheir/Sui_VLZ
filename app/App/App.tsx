"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState, useEffect } from "react";
import { Counter } from "../Counter";
import { CreateCounter } from "../CreateCounter";
import { CounterList } from "../components/CounterList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "./app.css"; // Only import once
import { ConnectButton } from "@mysten/dapp-kit";

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState<string | null>(null);
  const [view, setView] = useState<"create" | "search" | "counter">("create");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (isValidSuiObjectId(hash)) {
      setCounter(hash);
      setView("counter");
    }
  }, []);

  const handleCounterCreated = (id: string) => {
    window.location.hash = id;
    setCounter(id);
    setView("counter");
  };

  const handleCounterSelected = (id: string) => {
    window.location.hash = id;
    setCounter(id);
    setView("counter");
  };

  const goBackToSelection = () => {
    setCounter(null);
    setView("create");
    window.location.hash = "";
  };

  return (
    <div className="container">
      <Card className="card">
        <CardContent className="card-content">
          {currentAccount ? (
            counterId ? (
              <div className="counter-view">
                <div className="counter-header">
                  <Button
                    onClick={goBackToSelection}
                    variant="outline"
                    className="back-button"
                  >
                    ← Back to Counter Selection
                  </Button>
                  <div className="counter-id">
                    Counter ID: {counterId.slice(0, 8)}...{counterId.slice(-8)}
                  </div>
                </div>

                <Counter id={counterId} />
              </div>
            ) : (
              <div className="selection-view">
                <div className="navigation">
                  <Button
                    variant={view === "create" ? "default" : "outline"}
                    onClick={() => setView("create")}
                    className={
                      view === "create" ? "nav-button-active" : "nav-button"
                    }
                  >
                    Create New Counter
                  </Button>
                  <Button
                    variant={view === "search" ? "default" : "outline"}
                    onClick={() => setView("search")}
                    className={
                      view === "search" ? "nav-button-active" : "nav-button"
                    }
                  >
                    Find Existing Counter
                  </Button>
                </div>

                {view === "create" && (
                  <CreateCounter onCreated={handleCounterCreated} />
                )}

                {view === "search" && (
                  <CounterList onSelectCounter={handleCounterSelected} />
                )}
              </div>
            )
          ) : (
            <div className="no-wallet">
              <h2 className="title">No Wallet connected</h2>
              <p className="subtitle">
                Please connect your wallet to get started
              </p>
              <ConnectButton />
              
              
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
