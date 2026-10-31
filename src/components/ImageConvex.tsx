import { convexQuery } from '@convex-dev/react-query';
import { Image, ImageProps } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

type ImageConvexProps = Omit<ImageProps, 'src'> & {
    imageId: Id<"_storage">
}

function ImageConvex({ imageId, ...imageProps }: ImageConvexProps) {
    const { data: imageUrl } = useSuspenseQuery(
        convexQuery(api.files.get, { fileId: imageId }),
    );
    return (
        <Image {...imageProps} src={imageUrl} />
    )
}

export default ImageConvex
