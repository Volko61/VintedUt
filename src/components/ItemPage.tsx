import { convexQuery } from '@convex-dev/react-query';
import { Carousel } from '@mantine/carousel';
import { Avatar, Button, Group, Rating, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import ImageConvex from './ImageConvex';
import { IconHeart } from '@tabler/icons-react';
import { useMutation } from 'convex/react';

function ItemPage({ itemId }: { itemId: Id<"items"> }) {
    const { data: item } = useSuspenseQuery(
        convexQuery(api.items.read, { id: itemId }),
    );

    const { data: likeValue } = useSuspenseQuery(
        convexQuery(api.items.getLikeValue, { itemId }),
    );

    const doLike = useMutation(api.items.like);
    const createConversation = useMutation(api.conversations.createConversation);

    if (!item) throw new Error(`Item ${itemId} not found`)

    const { data: seller } = useSuspenseQuery(
        convexQuery(api.users.read, { id: item.authorId }),
    );
    if (!seller) throw new Error(`Seller ${item.authorId} not found`)
    const { data: averageEval } = useSuspenseQuery(
        convexQuery(api.users.getEvalAverageAboutUser, { userId: item.authorId }),
    );
    return (
        <>
            <Group>
                <div style={{ position: 'relative' }}>
                    <Carousel withIndicators height={200}>
                        {item.imageIds.map((imageId) =>
                            <Carousel.Slide key={imageId}>
                                <ImageConvex imageId={imageId} />
                            </Carousel.Slide>
                        )}
                    </Carousel>
                    <IconHeart
                        onClick={() => doLike({ itemId })}
                        fill={likeValue ? "red" : ""}
                        style={{ position: 'absolute', bottom: 8, right: 8, cursor: 'pointer', zIndex: 1 }}
                    />
                </div>
                <Stack>
                    <Text>{item.title}</Text>
                    <Text>{item.state}</Text>
                    <Text>{item.size}</Text>
                    <Text>{item.price}€</Text>
                    <Group>
                        {item.colors?.map((color) => (
                            <div
                                key={color}
                                title={color}
                                style={{
                                    background: color === 'multicolor'
                                        ? 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)'
                                        : color,
                                    height: 50,
                                    width: 50,
                                    borderRadius: '10%',
                                }}
                            />
                        ))}
                    </Group>
                    <Group>
                        <Avatar src={seller.image} />
                        {seller.image}
                        <Stack>
                            <Text>{seller.name}</Text>
                            <Group>
                                <Rating value={averageEval.average} readOnly />
                                <Text>{averageEval.numberOfReviews} reviews</Text>
                            </Group>
                        </Stack>
                    </Group>
                </Stack>
            </Group>
            <Text>{item.description}</Text>
            <Stack>
                <Button onClick={() => {
                    createConversation({ content: "hi", itemId })
                }}>Message</Button>
            </Stack>
        </>
    )
}

export default ItemPage