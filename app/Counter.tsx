import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "./counter.css"

export function Counter({ id }: { id: string }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  const [waitingForTxn, setWaitingForTxn] = useState("");

  const executeMoveCall = (method: "increment" | "reset" | "decrement") => {
    setWaitingForTxn(method);

    const tx = new Transaction();

    if (method === "reset") {
      tx.moveCall({
        arguments: [tx.object(id), tx.pure.u64(0)],
        target: `${counterPackageId}::counter::set_value`,
      });
    }
    if (method === "increment") {
      tx.moveCall({
        arguments: [tx.object(id)],
        target: `${counterPackageId}::counter::increment`,
      });
    } else {
      tx.moveCall({
        arguments: [tx.object(id)],
        target: `${counterPackageId}::counter::decrement`,
      });
    }

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (tx) => {
          suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
            await refetch();
            setWaitingForTxn("");
          });
        },
      },
    );
  };

  if (isPending)
    return (
      <Alert>
        <AlertDescription className="text-muted-foreground">
          Loading...
        </AlertDescription>
      </Alert>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error.message}</AlertDescription>
      </Alert>
    );

  if (!data.data)
    return (
      <Alert>
        <AlertDescription className="text-muted-foreground">
          Not found
        </AlertDescription>
      </Alert>
    );

  const ownedByCurrentAccount =
    getCounterFields(data.data)?.owner === currentAccount?.address;

  return (
<Card className="card">
  <CardHeader>
    <CardTitle className="card-title">Counter {id}</CardTitle>
    <CardDescription className="card-description">
      Count: {getCounterFields(data.data)?.value}
    </CardDescription>
  </CardHeader>
  <CardContent className="card-content">
    <Button
      onClick={() => executeMoveCall("increment")}
      disabled={waitingForTxn !== ""}
      className="button-increment"
    >
      {waitingForTxn === "increment" ? (
        <ClipLoader size={20} color="green" />
      ) : (
        "Against"
      )}
    </Button>
    <Button
      onClick={() => executeMoveCall("decrement")}
      disabled={waitingForTxn !== ""}
      className="button-decrement"
    >
      {waitingForTxn === "decrement" ? (
        <ClipLoader size={20} color="blue" />
      ) : (
        "For"
      )}
    </Button>
  </CardContent>
</Card>
  );
}
function getCounterFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  return data.content.fields as { value: number; owner: string };
}
