import { Group, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconHeart, IconSearch } from '@tabler/icons-react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'

function ItemSearchInput({ children }: { children: ReactNode }) {
    const navigate = useNavigate()
    const urlQuery = useSearch({ strict: false, select: (s) => (s as { query?: string }).query ?? '' })
    const [value, setValue] = useState(urlQuery)
    const [debounced] = useDebouncedValue(value, 300)

    useEffect(() => {
        setValue(urlQuery)
    }, [urlQuery])

    useEffect(() => {
        const trimmed = debounced.trim()
        if (trimmed === urlQuery) return
        navigate({ to: '/search', search: (prev) => ({ ...prev, query: trimmed }), replace: true })
    }, [debounced])

    return (<>
        <Group mb={20}>
            <TextInput
                flex={1}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                placeholder="Search"
            />
            <IconHeart fill='red'/>
        </Group>
        {children}
    </>
    )
}

export default ItemSearchInput