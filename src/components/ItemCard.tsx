import { convexQuery } from '@convex-dev/react-query'
import { Card, CardSection, Image, Stack } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { Doc } from '../../convex/_generated/dataModel'
import { Link } from '@tanstack/react-router'

export default function ItemCard({ item }: { item: Doc<"items"> }) {
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
        </Card>
    </Link>
}
