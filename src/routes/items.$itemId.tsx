import { createFileRoute } from '@tanstack/react-router'
import { Id } from '../../convex/_generated/dataModel';
import { Chat } from '@/components/Chat';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../convex/_generated/api';
import ItemPage from '@/components/ItemPage';

export const Route = createFileRoute('/items/$itemId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { itemId: itemIdRaw } = Route.useParams();
    const itemId = itemIdRaw as Id<"items">;
    return (
        <ItemPage itemId={itemId} />
    );
}
