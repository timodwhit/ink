import { Button, Group, TextInput } from "@mantine/core";
import { Form } from "react-router-dom";
import type { IJournal } from "../helpers/journals.ts";

type Props = {
  // It would be null when this is used to create a new journal.
  journal: IJournal | null;
  onSubmit: () => void;
  onDelete: () => void;
};
export function JournalEditForm({ journal, onSubmit, onDelete }: Props) {
  return (
    <Form
      method={journal ? "patch" : "post"}
      onSubmit={onSubmit}
      action={journal ? `/journal/${journal.id}/edit` : "/"}
    >
      <TextInput
        name={"name"}
        placeholder={"Journal Name"}
        defaultValue={journal ? journal.name : ""}
        size={"lg"}
      />
      <Group justify={"space-between"}>
        <Button type={"submit"} value={journal ? "Update" : "Create"} mt={"md"}>
          {journal ? "Update" : "Create"}
        </Button>
        {journal && (
          <Button
            variant={"transparent"}
            value={"Delete"}
            mt={"md"}
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </Group>
    </Form>
  );
}
