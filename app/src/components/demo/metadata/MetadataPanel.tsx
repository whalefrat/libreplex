import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import {
//     usePermissionsHydratedWithCollections
// } from "stores/accounts/useCollectionsById";

import { useCallback, useState } from "react";

import { IRpcObject } from "components/executor/IRpcObject";
import { Group } from "query/group";
import { Metadata, useMetadataByAuthority } from "query/metadata";
import useSelectedMetadata from "../collections/useSelectedMetadata";
import { CreateMetadataDialog } from "./CreateMetadataDialog";
import { MetadataRow } from "./MetadataRow";

export const BaseMetadataPanel = () => {
  const { publicKey } = useWallet();

  const { connection } = useConnection();

  const { data: metadata, refetch } = useMetadataByAuthority(
    publicKey,
    connection
  );

  const selectedMetadataKeys = useSelectedMetadata(
    (state) => state.selectedMetadataKeys
  );
  const toggleSelectedMetadata = useSelectedMetadata(
    (state) => state.toggleSelectedMetadataKey
  );

  const setSelectedMetadataKeys = useSelectedMetadata(
    (state) => state.setSelectedMetadataKeys
  );

  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleSelectAll = useCallback(
    (_selectAll: boolean) => {
      setSelectedMetadataKeys(
        new Set(_selectAll ? metadata.map((item) => item.pubkey) : [])
      );
      setSelectAll(_selectAll);
    },
    [metadata, setSelectedMetadataKeys]
  );
  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Group | undefined;
  }>({
    open: false,
    collection: undefined,
  });

  const [activeMetadata, setActiveMetadata] = useState<IRpcObject<Metadata>>();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "start",
        alignItems: "start",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          width: "100%",
        }}
        columnGap={2}
      >
        <Button
          onClick={() => setEditorStatus({ open: true, collection: undefined })}
        >
          Create Metadata
        </Button>

        <CreateMetadataDialog
          open={editorStatus.open}
          onClose={() => {
            setEditorStatus({
              open: false,
              collection: undefined,
            });
          }}
        />
        <Button
          onClick={() => {
            refetch();
          }}
        >
          <RepeatIcon />
        </Button>
      </Box>

      {selectedMetadataKeys && activeMetadata ? (
        <Box display="flex" columnGap={3} alignItems="center">
          <Heading>Selected Collection : {activeMetadata.item.name}</Heading>
          <Button onClick={() => setActiveMetadata(undefined)}>Clear</Button>
        </Box>
      ) : (
        <Box sx={{ maxWidth: "100%", maxHeight: "100%" }}>
          <Box pt={3} pb={3}>
            <Heading>Metadata ({metadata?.length ?? "-"})</Heading>
          </Box>
          <TableContainer
            sx={{
              overflow: "auto",
              width: "100%",
              maxHeight: "50vh",
              overflowY: "auto",
            }}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th colSpan={5}></Th>
                  <Th colSpan={4}>
                    <Center>Extended</Center>
                  </Th>
                </Tr>

                <Tr>
                  <Th>
                    <Center>
                      <Checkbox
                        checked={selectAll}
                        onChange={(e) => {
                          toggleSelectAll(e.currentTarget.checked);
                        }}
                      />
                    </Center>
                  </Th>
                  <Th>Image</Th>
                  <Th>
                    <Center>Data</Center>
                  </Th>
                  <Th>Collection</Th>
                  <Th>Asset type</Th>

                  <Th>Royalties</Th>
                  <Th>
                    <Center>Signers</Center>
                  </Th>
                  <Th>
                    <Center>Attributes</Center>
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {metadata?.map((item, idx) => (
                  <MetadataRow
                    key={idx}
                    item={item}
                    selectedMetadataObjs={selectedMetadataKeys}
                    toggleSelectedMetadata={toggleSelectedMetadata}
                    activeMetadata={activeMetadata}
                    setActiveMetadata={setActiveMetadata}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* {collection && (
        <CollectionViewer
          permissions={permissionsByCollection[collection.pubkey.toBase58()]}
          collection={collection}
          setCollection={setCollection}
        />
      )} */}
    </Box>
  );
};
