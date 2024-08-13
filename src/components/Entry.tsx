import {
	ActionIcon,
	Divider,
	Flex,
	Group,
	Modal,
	Popover,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconDots,
	IconDownload,
	IconSettings,
	IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import type { IJournalEntry } from "../helpers/entries.ts";
import { saveToFile } from "../helpers/saveToFile.ts";
import { EntryDeleteForm } from "./EntryDeleteForm.tsx";
import { EntryFormWrapper } from "./EntryFormWrapper.tsx";

interface Props {
	entry: IJournalEntry;
}

export function Entry({ entry }: Props) {
	const [editActive, setEditActive] = useState(false);
	const [confirmDeleteOpened, { open, close }] = useDisclosure();
	const [opened, setOpened] = useState(false);
	return (
		<div>
			<Divider
				variant="dashed"
				label={
					<Group gap="xs">
						<Text size={"xs"}>
							{`${entry.created_date.toLocaleDateString()} ${entry.created_date.toLocaleTimeString()}`}
						</Text>
						<Popover
							position="top"
							offset={{ mainAxis: 0, crossAxis: 0 }}
							opened={opened}
							onChange={setOpened}
						>
							<Popover.Target>
								<ActionIcon
									variant={"subtle"}
									size={"xs"}
									title={"See Options"}
									onClick={() => setOpened((o) => !o)}
								>
									<IconDots />
								</ActionIcon>
							</Popover.Target>
							<Popover.Dropdown>
								<Group gap={"xs"}>
									<ActionIcon
										variant={"subtle"}
										onClick={() => {
											saveToFile(
												`entry_${entry.created_date.toISOString()}.txt`,
												entry.entry,
											);
											setOpened((o) => !o);
										}}
										size={"xs"}
										title={"Delete Entry"}
									>
										<IconDownload />
									</ActionIcon>
									<ActionIcon
										variant={"subtle"}
										onClick={() => {
											setEditActive(true);
										}}
										title={"Edit Entry"}
										size={"xs"}
									>
										<IconSettings />
									</ActionIcon>
									<ActionIcon
										variant={"subtle"}
										onClick={() => {
											open();
											setOpened((o) => !o);
										}}
										title={"Delete Entry"}
										size={"xs"}
									>
										<IconTrash />
									</ActionIcon>
								</Group>
							</Popover.Dropdown>
						</Popover>
					</Group>
				}
				labelPosition={"right"}
			/>
			<Flex
				py={"xs"}
				w="100%"
				justify={"space-between"}
				align={"flex-start"}
				style={{ whiteSpace: "pre-line" }}
			>
				{editActive ? (
					<EntryFormWrapper
						entry={entry}
						onSubmit={() => {
							setEditActive(false);
						}}
						forceConfirm={true}
					/>
				) : (
					<Text size={"lg"} onClick={() => setEditActive(true)}>
						{entry.entry}
					</Text>
				)}
			</Flex>
			{confirmDeleteOpened && (
				<Modal
					opened={confirmDeleteOpened}
					onClose={() => {
						close();
					}}
					title={"Are you sure?"}
				>
					<EntryDeleteForm entry={entry} onCancel={close} />
				</Modal>
			)}
		</div>
	);
}
