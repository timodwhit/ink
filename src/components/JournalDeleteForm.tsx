import { Button, Text } from "@mantine/core";
import { Form } from "react-router-dom";
import type { IJournal } from "../helpers/journals.ts";

interface Props {
	journal: IJournal;
	onSubmit: () => void;
	onCancel: () => void;
}

export function JournalDeleteForm({ journal, onSubmit, onCancel }: Props) {
	return (
		<Form
			method={"delete"}
			onSubmit={() => {
				onSubmit();
			}}
			action={`/journal/${journal.id}/delete`}
		>
			<Text>
				{" "}
				Are you sure you want to delete this journal? Deleting a journal will
				delete all entries as well?
			</Text>
			<Button type={"submit"} value={"Delete This Journal"} mt={"md"}>
				Delete This Journal
			</Button>
			<Button
				variant={"transparent"}
				value={"Cancel"}
				mt={"md"}
				onClick={() => onCancel()}
			>
				Cancel
			</Button>
		</Form>
	);
}
