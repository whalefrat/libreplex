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
  const { connection } = useConnection();
  console.log("connection_old",connection)

  const rpcUrl = 'https://api.mainnet-beta.solana.com';
  const connection_new = new Connection(rpcUrl, 'confirmed'); 
  console.log("connection_new",connection_new)
 
  const { data, refetch, isFetching } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_PROGRAM_ID
  );

  enum View {
    WithInscriptions,
    WithoutInscriptions,
    All,
  }

  const mintIds = useMemo(() => data.map((item) => item.item.mint).sort((a,b)=>a.toBase58().localeCompare(b.toBase58())), [data]);

  return <LegacyMintInscriber mintIds={mintIds} />;
};
