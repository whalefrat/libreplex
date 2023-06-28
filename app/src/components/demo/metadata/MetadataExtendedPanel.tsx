import { IRpcObject } from "@/components/executor/IRpcObject";
import { MetadataExtended } from "shared-ui";
import React, { useState } from "react";
import { ExtendMetadataDialog } from "./extend/ExtendMetadataDialog";
import { Metadata } from "shared-ui";
import { Button, Td } from "@chakra-ui/react";

export const MetadataExtendedPanel = ({
  metadataExtended,
  metadata,
}: {
  metadataExtended: IRpcObject<MetadataExtended> | undefined;
  metadata: IRpcObject<Metadata>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return metadataExtended ? <><Td>TEST</Td></> :<>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Extend metadata
      </Button>
      <ExtendMetadataDialog
        metadata={metadata}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  
};
