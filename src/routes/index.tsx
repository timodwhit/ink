import { Anchor, Container, List } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { Link, useLoaderData } from "react-router-dom";
import type { RootLoaderData } from "./root.tsx";

export default function Index() {
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
				</List>
			) : (
				<>
					<h1>Ink.</h1>
					<h2>A journal meant for journaling.</h2>
					<p>This ain't your notes app, darlin`.</p>
				</>
			)}
		</Container>
	);
}
