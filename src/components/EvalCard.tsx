import { convexQuery } from '@convex-dev/react-query';
import { Avatar, Group, Rating, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

function EvalCard({ evalId }: { evalId: Id<"evaluations"> }) {
    const { data: evaluation } = useSuspenseQuery(convexQuery(api.evaluations.read, { id: evalId }))
    if (evaluation == null) throw new Error(`Cannot find evaluation ${evalId}`)
    const { data: user } = useSuspenseQuery(convexQuery(api.users.read, { id: evaluation.authorId }))
    if (user == null) throw new Error(`Cannot find user ${evaluation.authorId}`)
    let avatarUrl = null
    if (user.image != null) {
        const { data: imageUrl } = useSuspenseQuery(convexQuery(api.files.get, { fileId: (user.image || '') as Id<"_storage"> }))
        avatarUrl = imageUrl
    }
    return (
        <Group>
            <Avatar src={avatarUrl} />
            <Stack>
                <Text>{user.name}</Text>
                <Group>
                    <Rating value={evaluation.stars} readOnly />
                    <Text>{evaluation.review}</Text>
                </Group>
            </Stack>
        </Group>
    )
}

export default EvalCard