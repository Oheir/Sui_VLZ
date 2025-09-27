import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";
import "./createcounter.css";

export function CreateCounter({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const {
    mutate: signAndExecute,
    isSuccess,
    isPending,
  } = useSignAndExecuteTransaction();

  function create() {
    console.log("creating tx");
    const tx = new Transaction();

    tx.moveCall({
      arguments: [],
      target: `${counterPackageId}::counter::create`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          onCreated(effects?.created?.[0]?.reference?.objectId!);
        },
      },
    );
  }

  return (
  <Card className="container">
  <CardHeader>
    <CardTitle style={{ color: "#e6c384" ,fontSize : "2rem"}}>Create New Forum</CardTitle>

  </CardHeader>
  <CardContent>
    <Button
      size="lg"
      onClick={create}
      disabled={isSuccess || isPending}
      className="button"
    >
      {isSuccess || isPending ? (
        <ClipLoader size={20} color="white" />
      ) : (
        "Create Counter"
      )}
    </Button>
  </CardContent>
</Card>
  );
}
