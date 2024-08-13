import {
	type ActionFunctionArgs,
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
	ColorSchemeScript,
	Flex,
	Group,
	MantineProvider,
	NavLink,
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
import { JournalEditModals } from "../components/JournalEditModals.tsx";
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

export type RootLoaderData = {
	journals: IJournal[];
};

async function loader(): Promise<RootLoaderData> {
	const journals = await getJournals();
	return { journals };
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const name = formData.get("name") as string;
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
	const [
		openedJournalEdits,
		{ open: openJournalEdits, close: closeJournalEdits },
	] = useDisclosure(false);
	const [opened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure();
	const [activeJournal, setActiveJournal] = useState<IJournal | null>(null);
	const { journals } = useLoaderData() as RootLoaderData;

	const items = journals.map((item) => (
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
							onClick={openJournalEdits}
						/>
						{items}
					</AppShell.Navbar>
					<AppShell.Main>
						<Outlet />
					</AppShell.Main>
					<JournalEditModals
						opened={openedJournalEdits}
						close={closeJournalEdits}
						journal={activeJournal}
						setJournal={setActiveJournal}
					/>
				</AppShell>
			</MantineProvider>
		</>
	);
}
