import { Container, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import type { IJournalEntry } from "../helpers/entries.ts";
import { EntryForm } from "./EntryForm.tsx";

interface Props {
  entry: IJournalEntry | null;
  onSubmit?: () => void;
  forceConfirm: boolean;
}

export function EntryFormWrapper({ entry, onSubmit, forceConfirm }: Props) {
  const [text, setText] = useState(entry ? entry.entry : "");
  const [focusMode, { open, close }] = useDisclosure(false);

  return (
    <>
      <Container size={"xs"} style={{ width: "100%" }} p={0}>
        <EntryForm
          entry={entry}
          text={text}
          setText={setText}
          focusMode={false}
          openFocusMode={open}
          closeFocusMode={close}
          onSubmit={onSubmit}
          confirm={forceConfirm}
        />
      </Container>
      <Modal
        opened={focusMode}
        onClose={() => {
          close();
        }}
        fullScreen
      >
        <Container size={"xs"}>
          <EntryForm
            entry={entry}
            text={text}
            setText={setText}
            focusMode={true}
            openFocusMode={open}
            closeFocusMode={close}
            onSubmit={onSubmit}
            confirm={forceConfirm}
          />
        </Container>
      </Modal>
    </>
  );
}
