import {
  type ActionFunctionArgs,
  Link,
  Outlet,
  type RouteObject,
  NavLink as RouterNavLink,
  redirect,
  useLoaderData,
  Navigate,
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
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBallpenFilled,
  IconBook,
  IconPlus,
  IconSettings,
  IconLogout,
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
import Login from "./login.tsx";
import Signup from "./signup.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";

export type RootLoaderData = {
  journals: IJournal[];
};

async function loader({ request }: ActionFunctionArgs): Promise<RootLoaderData> {
  const url = new URL(request.url);
  const isAuthRoute = url.pathname === '/login' || url.pathname === '/signup';

  // Check if user is authenticated
  const storedUser = localStorage.getItem('user');
  if (!storedUser && !isAuthRoute) {
    throw redirect('/login');
  }

  if (isAuthRoute) {
    return { journals: [] };
  }

  const user = JSON.parse(storedUser!);
  const journals = await getJournals(user.id);
  return { journals };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    throw redirect('/login');
  }
  const user = JSON.parse(storedUser);
  const journal = await createJournal(name, "small", user.id);
  return redirect(`journal/${journal.id}`);
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export const route: RouteObject = {
  path: "/",
  element: <Root />,
  errorElement: <ErrorPage />,
  loader,
  action,
  children: [
    {
      index: true,
      element: <ProtectedRoute><Index /></ProtectedRoute>,
      loader
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "signup",
      element: <Signup />,
    },
    {
      errorElement: <ErrorPage />,
      children: [
        {
          path: "journal/:journalId",
          action: journalRootAction,
          loader: journalRootLoader,
          element: <ProtectedRoute><Journal /></ProtectedRoute>,
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
  const { user, logout } = useAuth();

  if (!user) {
    return <Outlet />;
  }

  const items = journals.map((item) => (
    <Flex key={item.id} align={"center"}>
      <NavLink
        label={item.name}
        description={new Date(item.created_date).toLocaleDateString()}
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
            <Group>
              <DarkModeToggle />
            </Group>
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
          <Box style={{ marginTop: 'auto' }}>
            <NavLink
              label="Logout"
              leftSection={<IconLogout />}
              variant="subtle"
              onClick={logout}
            />
          </Box>
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
    </>
  );
}
