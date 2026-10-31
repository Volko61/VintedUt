import { convexQuery } from '@convex-dev/react-query'
import { Card, CardSection, Image, Stack } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { IconHeart } from '@tabler/icons-react'

export default function ItemCard({ itemId }: { itemId: Id<"items"> }) {
    const { data: item } = useSuspenseQuery(convexQuery(api.items.read, { id: itemId }))
    if (item == null) throw Error(`Cannot find the item ${itemId}`)
    const { data: likeValue } = useSuspenseQuery(
        convexQuery(api.items.getLikeValue, { itemId }),
    );

    const doLike = useMutation(api.items.like);

    const { data: imageUrl } = useSuspenseQuery(convexQuery(api.files.get, { fileId: item.imageIds[0] }))
    return <Link
        to="/items/$itemId"
        params={{ itemId: item._id }}>
        <Card orientation="horizontal">
            <CardSection inheritPadding >
                <Image height={200} src={imageUrl} />
            </CardSection>
            <CardSection inheritPadding px="md">
                <Stack>
                    <p>{item.title}</p>
                    <p>{item.price}€</p>
                </Stack>
            </CardSection>
            <IconHeart
                onClick={() => doLike({ itemId })}
                fill={likeValue ? "red" : ""}
                style={{ position: 'absolute', bottom: 8, right: 8, cursor: 'pointer', zIndex: 1 }}
            />
        </Card>
    </Link>
}
