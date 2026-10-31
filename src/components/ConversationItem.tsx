import { Link } from '@tanstack/react-router'
import { Avatar, Container } from '@mantine/core';
import type { FunctionReturnType } from "convex/server";
import { api } from "../../convex/_generated/api";
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { Id } from '../../convex/_generated/dataModel';

export type Conversation = FunctionReturnType<typeof api.conversations.listMine>[number];

function ConversationItem({ conversation }: { conversation: Conversation }) {
    const { data: me } = useSuspenseQuery(convexQuery(api.users.me, {}))
    const { data: seller } = useSuspenseQuery(convexQuery(api.users.read, { id: conversation.seller }))
    const { data: buyer } = useSuspenseQuery(convexQuery(api.users.read, { id: conversation.buyer }))
    const { data: item } = useSuspenseQuery(convexQuery(api.items.read, { id: conversation.itemId }))
    const { data: latestMessage } = useSuspenseQuery(convexQuery(
        api.conversations.latestMessage, {
        conversationId: conversation._id
    }))
    if (me == null) throw Error("Cannot find me")
    if (seller == null) throw Error("Cannot find the seller")
    if (buyer == null) throw Error("Cannot find the buyer")
    if (item == null) throw Error("Cannot find the item")
    const otherPerson = me._id === seller._id ? buyer : seller
    let avatarUrl = null
    if (otherPerson.image != null) {
        const { data: imageUrl } = useSuspenseQuery(convexQuery(api.files.get, { fileId: (otherPerson.image || '') as Id<"_storage"> }))
        avatarUrl = imageUrl
    }
    return (
        <Link
            to="/messages/$conversationId"
            params={{ conversationId: conversation._id }}
        >
            <Avatar src={avatarUrl} alt={otherPerson.name} />
            <Container>
                <p>{item.title}</p>
                <p>{latestMessage?.content}</p>
            </Container>
            <p>{latestMessage?._creationTime}</p>
        </Link>
    )
}

export default ConversationItem