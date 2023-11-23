import {
  getInscriptionPda,
  useTokenAccountsByOwner,
} from "@libreplex/shared-ui";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { useMultipleAccountsById } from "shared-ui/src/sdk/query/metadata/useMultipleAccountsById";
import { LegacyMintInscriber } from "./LegacyMintInscriber";
import { Connection } from "@solana/web3.js";

export const MyMintsInscriber = () => {
  const { publicKey } = useWallet();
  //const { connection } = useConnection();
  //console.log("connection_old", connection)

  const rpcUrl = 'https://solana-mainnet.g.alchemy.com/v2/pMmDQ11mDHM4EK4S1w_dbTLXvhFQmU7s';
  const connection = new Connection(rpcUrl, 'confirmed');
  console.log("connection", connection)

  const { data, refetch, isFetching } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_PROGRAM_ID
  );
  console.log("data", data)

  enum View {
    WithInscriptions,
    WithoutInscriptions,
    All,
  }

  const mintIds = useMemo(() => data.map((item) => item.item.mint).sort((a, b) => a.toBase58().localeCompare(b.toBase58())), [data]);

  return <LegacyMintInscriber mintIds={mintIds} />;
};
