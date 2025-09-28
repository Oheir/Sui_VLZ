'use client'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import './counterlist.css';

interface CounterData {
  objectId: string;
  value: number;
  owner: string;
}

function getCounterFields(data: any): { value: number; owner: string } | null {
  if (data?.content?.dataType !== "moveObject") {
    return null;
  }
  return data.content.fields as { value: number; owner: string };
}

export function CounterList({ onSelectCounter }: { onSelectCounter: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CounterData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCounters = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Search by object ID if it's a valid Sui object ID
      if (searchQuery.startsWith("0x") && searchQuery.length === 66) {
        // Create Sui client and query directly
        const client = new SuiClient({ url: getFullnodeUrl("testnet") });
        
        const object = await client.getObject({
          id: searchQuery,
          options: {
            showContent: true,
            showOwner: true,
            showType: true,
          },
        });

        if (object.data && object.data.content?.dataType === "moveObject") {
          const fields = getCounterFields(object.data);
          if (fields) {
            setSearchResults([{
              objectId: searchQuery,
              value: fields.value,
              owner: fields.owner,
            }]);
          } else {
            setError("Object found but is not a counter");
          }
        } else {
          setError("Object not found or invalid");
        }
      } else {
        setError("Please enter a valid Sui object ID (starts with 0x and is 66 characters long)");
      }
    } catch (err) {
      setError("Error searching for counters");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="counter-list">
      <div className="counter-list-header">
        <h2 className="counter-list-title">Join Existing Community </h2>
        <p className="counter-list-subtitle">Search for an existing Community by their ID</p>
      </div>

      {/* Search by Object ID */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Search by Community ID</h3>
        </div>
        <div className="card-content">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter counter object ID (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-text"
            />
            <button
              onClick={searchCounters}
              disabled={isSearching}
              className="button button-primary"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Search Results ({searchResults.length})</h3>
          </div>
          <div className="card-content search-results-list">
            {searchResults.map((counter) => (
              <div key={counter.objectId} className="result-item">
                <div className="result-details">
                  <p className="result-title">Counter Value: {counter.value}</p>
                  <p className="result-owner">
                    Owner: {counter.owner.slice(0, 8)}...{counter.owner.slice(-8)}
                  </p>
                  <p className="result-id">
                    ID: {counter.objectId.slice(0, 8)}...{counter.objectId.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => onSelectCounter(counter.objectId)}
                  className="button button-success"
                >
                  Select Counter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
