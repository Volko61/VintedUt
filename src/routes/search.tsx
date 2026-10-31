import { createFileRoute } from "@tanstack/react-router";

import type { Infer } from "convex/values";

import type { sortValidator } from "../../convex/schema";
import { SearchPage } from "../components/SearchPage";

type ItemSearchSortOptions = Infer<typeof sortValidator>

type ItemSearch = {
  filter: string
  query: string
  sort: ItemSearchSortOptions
}

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>): ItemSearch => {
    return {
      filter: (search.filter as string) || '',
      query: (search.query as string) || '',
      sort: (search.sort as ItemSearchSortOptions) || 'newest',
    }
  },
 
});

