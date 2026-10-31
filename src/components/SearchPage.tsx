import { Route } from "@/routes/search";
import { Button, Flex, Text } from "@mantine/core";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ItemCard from "./ItemCard";


export function SearchPage() {
  const { query, sort } = Route.useSearch()
  const hasQuery = query.trim() !== ''

  const { results, status, loadMore } = usePaginatedQuery(
    api.items.search,
    { searchString: query, sort },
    { initialNumItems: 10 },
  )

  if (status === "LoadingFirstPage") return null
  if (hasQuery && results.length === 0 && status === "Exhausted") {
    return <Text c="dimmed">No results for "{query}"</Text>
  }

  return <>
    <Flex gap={20} direction="column">
      {results.map((item) => <ItemCard key={item._id} itemId={item._id} />)}
      {status === "CanLoadMore" && (
        <Button onClick={() => loadMore(10)}>Load more</Button>
      )}
    </Flex>
  </>;
}
