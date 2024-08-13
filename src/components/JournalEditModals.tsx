import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { Dispatch } from "react";
import type { IJournal } from "../helpers/journals.ts";
import { JournalDeleteForm } from "./JournalDeleteForm.tsx";
import { JournalEditForm } from "./JournalEditForm.tsx";

type Props = {
  opened: boolean;
  close: () => void;
  journal: IJournal | null;
  setJournal: Dispatch<IJournal | null>;
};

export function JournalEditModals({
  opened,
  close,
  journal,
  setJournal,
}: Props) {
  const [
    deleteJournalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setJournal(null);
        }}
        title={journal ? `Update ${journal.name}` : "Create New Journal"}
      >
        <JournalEditForm
          journal={journal}
          onSubmit={() => {
            close();
            setJournal(null);
          }}
          onDelete={() => {
            openDeleteModal();
            close();
          }}
        />
      </Modal>
      {journal && (
        <Modal
          opened={deleteJournalOpened}
          onClose={() => {
            closeDeleteModal();
            setJournal(null);
          }}
          title={`Delete ${journal.name}`}
        >
          <JournalDeleteForm
            journal={journal}
            onSubmit={() => {
              closeDeleteModal();
              setJournal(null);
            }}
            onCancel={closeDeleteModal}
          />
        </Modal>
      )}
    </>
  );
}
