import ItemCard from '@/components/ItemCard';
import { convexQuery } from '@convex-dev/react-query';
import { Avatar, Container, Flex, Group, Rating, Stack, Tabs, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { usePaginatedQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import EvalCard from '@/components/EvalCard';

export const Route = createFileRoute('/user/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId: userIdRaw } = Route.useParams();
  const userId = userIdRaw as Id<"users">;
  const { data: user } = useSuspenseQuery(convexQuery(api.users.read, { id: userId }))
  if (user == null) throw Error("Cannot find the seller")
  let avatarUrl = null
  if (user.image != null) {
    const { data: imageUrl } = useSuspenseQuery(convexQuery(api.files.get, { fileId: (user.image || '') as Id<"_storage"> }))
    avatarUrl = imageUrl
  }
  const { data: averageEval } = useSuspenseQuery(
    convexQuery(api.users.getEvalAverageAboutUser, { userId }),
  );
  const { data: evals } = useSuspenseQuery(
    convexQuery(api.users.getEvalsAboutUser, { userId }),
  );
  const { results: items, status, loadMore } = usePaginatedQuery(
    api.items.listOfUser,
    { userId },
    { initialNumItems: 10 },
  )
  return <Container>
    <Group>
      <Avatar src={avatarUrl} />
      <Stack>
        <Text>{user.name}</Text>
        <Group>
          <Rating value={averageEval.average} readOnly />
          <Text>{averageEval.numberOfReviews} reviews</Text>
        </Group>
      </Stack>
    </Group>
    <Tabs>
      <Tabs.List>
        <Tabs.Tab value="items">
          Annonces
        </Tabs.Tab>
        <Tabs.Tab value="evaluations">
          Evaluations
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="items">
        <Flex gap={20} mb={20} direction={"column"}>
          {items.map((item) => {
            return <ItemCard itemId={item._id} />
          })}
        </Flex>
      </Tabs.Panel>

      <Tabs.Panel value="evaluations">
        <Flex gap={20} mb={20} direction={"column"}>
          {evals.map((evaluation) => {
            return <EvalCard evalId={evaluation._id} />
          })}
        </Flex>
      </Tabs.Panel>
    </Tabs>
  </Container>
}
