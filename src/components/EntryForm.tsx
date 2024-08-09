import { ActionIcon, Stack, Textarea } from "@mantine/core";
import { IconFocus2, IconSend2 } from "@tabler/icons-react";
import { type Dispatch, useEffect, useRef } from "react";
import { useFetcher } from "react-router-dom";
import type { IJournalEntry } from "../helpers/entries.ts";

interface Props {
	entry: IJournalEntry | null;
	text: string;
	setText: Dispatch<string>;
	focusMode: boolean;
	openModal: () => void;
	closeModal: () => void;
	onSubmit?: () => void;
}

export function EntryForm({
	entry,
	text,
	setText,
	focusMode,
	openModal,
	closeModal,
	onSubmit,
}: Props) {
	const fetcher = useFetcher();
	const inputRef = useRef(null);

	useEffect(() => {
		if (fetcher.state === "loading") {
			// Clear form values
			setText("");
			closeModal();
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
	}, [fetcher, closeModal, focusMode, onSubmit, setText]);

	return (
		<fetcher.Form method="post" action={entry ? `/entry/${entry.id}/edit` : ""}>
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
				rightSection={
					<Stack justify={"space-between"} style={{ height: "100%" }}>
						<ActionIcon
							variant="subtle"
							size="sm"
							aria-label="Gradient action icon"
							type={"submit"}
						>
							<IconSend2 />
						</ActionIcon>
						{!focusMode && (
							<ActionIcon
								variant="subtle"
								size="sm"
								aria-label="Gradient action icon"
								onClick={openModal}
							>
								<IconFocus2 />
							</ActionIcon>
						)}
					</Stack>
				}
			/>
		</fetcher.Form>
	);
}
