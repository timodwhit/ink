import { Button, Group, Text } from "@mantine/core";
import { useFetcher } from "react-router-dom";
import type { IJournalEntry } from "../helpers/entries.ts";

interface Props {
	entry: IJournalEntry;
	onCancel: () => void;
}
export function EntryDeleteForm({ entry, onCancel }: Props) {
	const fetcher = useFetcher();

	return (
		<fetcher.Form method={"post"} action={`/entry/${entry.id}/delete`}>
			<Text>Are you sure you want to delete this entry?</Text>
			<Group mt="xl">
				<Button type={"submit"} variant={"filled"}>
					Delete
				</Button>
				<Button onClick={onCancel} variant={"outline"}>
					Cancel
				</Button>
			</Group>
		</fetcher.Form>
	);
}
