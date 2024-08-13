import {
  ActionIcon,
  Button,
  Flex,
  Modal,
  Stack,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFocus2, IconSend2, IconX } from "@tabler/icons-react";
import { type Dispatch, useEffect, useRef } from "react";
import { useFetcher } from "react-router-dom";
import type { IJournalEntry } from "../helpers/entries.ts";

interface Props {
  entry: IJournalEntry | null;
  text: string;
  setText: Dispatch<string>;
  focusMode: boolean;
  openFocusMode: () => void;
  closeFocusMode: () => void;
  onSubmit?: () => void;
  confirm: boolean;
}

export function EntryForm({
  entry,
  text,
  setText,
  focusMode,
  openFocusMode,
  closeFocusMode,
  onSubmit,
  confirm,
}: Props) {
  const [confirmOpen, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);

  const fetcher = useFetcher();
  const inputRef = useRef(null);

  useEffect(() => {
    if (fetcher.state === "loading") {
      // Clear form values
      setText("");
      closeFocusMode();
      if (onSubmit) {
        onSubmit();
      }
    }

    if (fetcher.state === "idle") {
      // On submit, change the focus back to the main form.
      if (!focusMode) {
        // @ts-expect-error
        inputRef.current.focus();
      }
    }
  }, [fetcher, closeFocusMode, focusMode, onSubmit, setText]);

  return (
    <>
      <fetcher.Form
        method="post"
        action={entry ? `/entry/${entry.id}/edit` : ""}
      >
        <Textarea
          ref={inputRef}
          aria-label={"New Entry"}
          name="entry"
          minRows={6}
          autosize
          placeholder={"What's on your mind, hun?"}
          variant={focusMode ? "unstyled" : "filled"}
          radius="xs"
          rightSectionProps={{
            style: { padding: "10px", alignItems: "flex-start" },
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          styles={{
            input: {
              fontSize: "lg",
            },
          }}
          size={"lg"}
          rightSection={
            <Stack justify={"space-between"} style={{ height: "100%" }}>
              {confirm ? (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  title="Save Edits"
                  aria-label="Save Edits"
                  onClick={openConfirm}
                >
                  <IconX />
                </ActionIcon>
              ) : (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  title="Save Inkling"
                  aria-label="Save Inkling"
                  type={"submit"}
                >
                  <IconSend2 />
                </ActionIcon>
              )}
              {!focusMode && (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  title="Open focus mode"
                  aria-label="Open focus mode"
                  onClick={openFocusMode}
                >
                  <IconFocus2 />
                </ActionIcon>
              )}
            </Stack>
          }
        />
      </fetcher.Form>
      {confirm && confirmOpen && (
        <Modal
          opened={confirmOpen}
          onClose={closeConfirm}
          title={"Save Edits?"}
        >
          <fetcher.Form
            method="post"
            action={entry ? `/entry/${entry.id}/edit` : ""}
          >
            <input type={"hidden"} value={text} name={"entry"} />
            <Flex justify={"space-between"}>
              <Flex gap={5}>
                <Button type={"submit"}>Save</Button>
                <Button
                  onClick={() => {
                    closeConfirm();
                    if (onSubmit) {
                      onSubmit();
                    }
                  }}
                  variant={"subtle"}
                >
                  Don't Save
                </Button>
              </Flex>
              <Button
                onClick={() => {
                  closeConfirm();
                }}
                variant={"transparent"}
              >
                Cancel
              </Button>
            </Flex>
          </fetcher.Form>
        </Modal>
      )}
    </>
  );
}
