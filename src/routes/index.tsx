import { Anchor, Button, Container, Flex, List } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBook, IconPlus } from "@tabler/icons-react";
import { Link, useLoaderData } from "react-router-dom";
import { JournalEditModals } from "../components/JournalEditModals.tsx";
import type { RootLoaderData } from "./root.tsx";

export default function Index() {
  const [
    openedJournalEdits,
    { open: openJournalEdits, close: closeJournalEdits },
  ] = useDisclosure(false);
  const { journals } = useLoaderData() as RootLoaderData;
  return (
    <Container size="xs">
      {journals.length > 0 ? (
        <List spacing="xs" size="sm" center icon={<IconBook />}>
          {journals.map((journal) => (
            <List.Item key={journal.id}>
              <Anchor component={Link} to={`/journal/${journal.id}`}>
                {journal.name}
              </Anchor>
            </List.Item>
          ))}
          <List.Item>
            <Anchor onClick={openJournalEdits}>
              <Flex gap={"5px"}>
                <IconPlus /> Create New Journal
              </Flex>
            </Anchor>
          </List.Item>
        </List>
      ) : (
        <>
          <h1>Ink.</h1>
          <h2>A journal meant for journaling.</h2>
          <p>This ain't your notes app, darlin`.</p>
          <Button
            leftSection={<IconPlus />}
            fullWidth
            onClick={openJournalEdits}
            my={30}
          >
            Create New Journal
          </Button>
        </>
      )}
      <JournalEditModals
        opened={openedJournalEdits}
        close={closeJournalEdits}
        journal={null}
        setJournal={() => {}}
      />
    </Container>
  );
}
