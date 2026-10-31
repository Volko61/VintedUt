import { createFileRoute } from '@tanstack/react-router'
import { Id } from '../../convex/_generated/dataModel';
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
