import { Container, Stack, Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import { Entry } from "../components/Entry.tsx";
import { EntryFormWrapper } from "../components/EntryFormWrapper.tsx";
import {
	createEntry,
	deleteEntry,
	getEntriesByJournal,
	updateEntry,
} from "../helpers/entries.ts";
import {
	deleteJournal,
	getJournal,
	updateJournal,
} from "../helpers/journals.ts";

export async function journalRootLoader({ params }) {
	const journal = await getJournal(params.journalId);
	const entries = await getEntriesByJournal(params.journalId);
	if (!entries) {
		throw new Response("", {
			status: 404,
			statusText: "Not Found",
		});
	}
	// Note that we sort here. Ideally, the sorting an option in the database query at some point and time.
	entries.sort((a, b) => {
		if (a.created_date < b.created_date) {
			return -1;
		}
		if (a.created_date > b.created_date) {
			return 1;
		}
		return 0;
	});
	return { journal, entries };
}

export async function journalRootAction({ request, params }) {
	const formData = await request.formData();
	const entry = formData.get("entry");
	await createEntry(params.journalId, entry);
	return { saved: true };
}

export async function journalEditAction({ request, params }) {
	const formData = await request.formData();
	const name = formData.get("name");
	await updateJournal(params.journalId, { name });
	return redirect(`/journal/${params.journalId}`);
}
export async function journalDeleteAction({ request, params }) {
	if (request.method === "DELETE") {
		console.log(params.journalId);
		await deleteJournal(params.journalId);
		return redirect("/");
	}
}

export async function entryEditAction({ request, params }) {
	const formData = await request.formData();
	const entry = formData.get("entry");
	await updateEntry(params.entryId, { entry });
	return { saved: true };
}
export async function entryDeleteAction({ request, params }) {
	await deleteEntry(params.entryId);
	return { saved: true };
}

export default function Journal() {
	const { journal, entries } = useLoaderData();
	const stackRef = useRef(null);

	useEffect(() => {
		// Load to the most recent every time.
		stackRef.current.scrollTop = stackRef.current.scrollHeight;
	}, []);

	return (
		<div
			style={{
				height:
					// this is a little on the gross side,
					"calc(100dvh - var(--app-shell-header-offset, 0rem) - var(--app-shell-padding) - var(--app-shell-footer-offset, 0rem) - var(--app-shell-padding))",
				display: "flex",
			}}
		>
			<Stack style={{ flex: "1 1 0%" }}>
				<div style={{ flex: "1 1 0%", overflowY: "auto" }} ref={stackRef}>
					{entries.length > 0 ? (
						<Container size={"xs"}>
							<Text ta={"center"} fs={"italic"} size={"sm"} mb={"sm"}>
								Entries from <strong>{journal.name}</strong>
							</Text>
							{entries.map((entry) => (
								<Entry key={entry.id} entry={entry} inStream={true} />
							))}
						</Container>
					) : (
						<Text ta={"center"} fs={"italic"} size={"sm"}>
							No entries for <strong>{journal.name}</strong> found!
						</Text>
					)}
				</div>
				<EntryFormWrapper entry={null} />
			</Stack>
		</div>
	);
}
