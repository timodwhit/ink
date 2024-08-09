import {
	Form,
	Link,
	Outlet,
	type RouteObject,
	NavLink as RouterNavLink,
	redirect,
	useLoaderData,
} from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import {
	ActionIcon,
	Anchor,
	AppShell,
	Box,
	Burger,
	Button,
	ColorSchemeScript,
	Flex,
	Group,
	MantineProvider,
	Modal,
	NavLink,
	TextInput,
	createTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconBallpenFilled,
	IconBook,
	IconPlus,
	IconSettings,
} from "@tabler/icons-react";
import { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle.tsx";
import { JournalDeleteForm } from "../components/JournalDeleteForm.tsx";
import {
	type IJournal,
	createJournal,
	getJournals,
} from "../helpers/journals.ts";
import ErrorPage from "./error-page.tsx";
import Index from "./index.tsx";
import Journal, {
	journalRootAction,
	journalRootLoader,
	journalEditAction,
	entryEditAction,
	entryDeleteAction,
	journalDeleteAction,
} from "./journal.tsx";

const theme = createTheme({
	primaryColor: "gray",
	colors: {
		gray: [
			"#f8f9fa",
			"#f1f3f5",
			"#e9ecef",
			"#dee2e6",
			"#ced4da",
			"#adb5bd",
			"#868e96",
			"#495057",
			"#343a40",
			"#212529",
		],
	},
});

async function loader() {
	const journals = await getJournals();
	return { journals };
}

export async function action({ request }) {
	const formData = await request.formData();
	const name = formData.get("name");
	const journal = await createJournal(name, "small");
	return redirect(`journal/${journal.id}`);
}

export const route: RouteObject = {
	path: "/",
	element: <Root />,
	errorElement: <ErrorPage />,
	loader,
	action,
	children: [
		{ index: true, element: <Index />, loader },
		{
			errorElement: <ErrorPage />,
			children: [
				{
					path: "journal/:journalId",
					action: journalRootAction,
					loader: journalRootLoader,
					element: <Journal />,
				},
				{
					path: "journal/:journalId/edit",
					action: journalEditAction,
				},
				{
					path: "journal/:journalId/delete",
					action: journalDeleteAction,
				},
				{
					path: "entry/:entryId/edit",
					action: entryEditAction,
				},
				{
					path: "entry/:entryId/delete",
					action: entryDeleteAction,
				},
			],
		},
	],
};

function Root() {
	const [createJournalOpened, { open, close }] = useDisclosure(false);
	const [
		deleteJournalOpened,
		{ open: openDeleteModal, close: closeDeleteModal },
	] = useDisclosure(false);
	const [opened, { toggle: toggleMenu, open: openMenu, close: closeMenu }] =
		useDisclosure();
	const [activeJournal, setActiveJournal] = useState<IJournal | null>(null);
	const { journals } = useLoaderData();

	const items = journals.map((item, index) => (
		<Flex key={item.id} align={"center"}>
			<NavLink
				label={item.name}
				description={item.created_date.toLocaleDateString()}
				leftSection={<IconBook />}
				variant={"subtle"}
				onClick={closeMenu}
				renderRoot={(props) => (
					<RouterNavLink to={`journal/${item.id}`} {...props} />
				)}
			/>
			<ActionIcon
				variant="subtle"
				aria-label={`Edit ${item.name}`}
				onClick={() => {
					setActiveJournal(item);
					open();
				}}
				size={18}
			>
				<IconSettings />
			</ActionIcon>
		</Flex>
	));
	return (
		<>
			<ColorSchemeScript defaultColorScheme="auto" />
			<MantineProvider defaultColorScheme="auto" theme={theme}>
				<AppShell
					header={{ height: 60 }}
					navbar={{
						width: 300,
						breakpoint: "sm",
						collapsed: { mobile: !opened, desktop: !opened },
					}}
					padding="md"
				>
					<AppShell.Header>
						<Group justify="space-between" h={"var(--app-shell-header-height)"}>
							<Box w={"2rem"}>
								<Burger opened={opened} onClick={toggleMenu} size="sm" />
							</Box>
							<Anchor component={Link} to={"/"} onClick={closeMenu}>
								<IconBallpenFilled />
							</Anchor>
							<DarkModeToggle />
						</Group>
					</AppShell.Header>
					<AppShell.Navbar p="md" style={{ overflowY: "auto" }}>
						<NavLink
							label={"Create New Journal"}
							leftSection={<IconPlus />}
							variant={"subtle"}
							onClick={open}
						/>
						{items}
					</AppShell.Navbar>
					<AppShell.Main>
						<Outlet />
					</AppShell.Main>
				</AppShell>
				<Modal
					opened={createJournalOpened}
					onClose={() => {
						close();
						setActiveJournal(null);
					}}
					title={
						activeJournal
							? `Update ${activeJournal.name}`
							: "Create New Journal"
					}
				>
					<Form
						method={"post"}
						onSubmit={() => {
							close();
							setActiveJournal(null);
						}}
						action={activeJournal ? `/journal/${activeJournal.id}/edit` : "/"}
					>
						<TextInput
							name={"name"}
							placeholder={"Journal Name"}
							defaultValue={activeJournal ? activeJournal.name : ""}
						/>
						<Group justify={"space-between"}>
							<Button
								type={"submit"}
								value={activeJournal ? "Update" : "Create"}
								mt={"md"}
							>
								{activeJournal ? "Update" : "Create"}
							</Button>
							{activeJournal && (
								<Button
									variant={"transparent"}
									value={"Delete"}
									mt={"md"}
									onClick={() => {
										openDeleteModal();
										close();
									}}
								>
									Delete
								</Button>
							)}
						</Group>
					</Form>
				</Modal>
				{activeJournal && (
					<Modal
						opened={deleteJournalOpened}
						onClose={() => {
							closeDeleteModal();
							setActiveJournal(null);
						}}
						title={`Delete ${activeJournal.name}`}
					>
						<JournalDeleteForm
							journal={activeJournal}
							onSubmit={() => {
								closeDeleteModal();
								setActiveJournal(null);
							}}
							onCancel={closeDeleteModal}
						/>
					</Modal>
				)}
			</MantineProvider>
		</>
	);
}
