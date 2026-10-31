import { MultiSelect } from '@mantine/core'
import { useState } from 'react'


function DropdownSize({ onChange }: { onChange?: (value: string[]) => void }) {
    const [value, setValue] = useState<string[]>([]);

    const handleChange = (newValue: string[]) => {
        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <MultiSelect
            label="Taille"
            placeholder="Selectionne ta taille..."
            data={['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']}
            value={value} onChange={handleChange}
            clearable
            clearSectionMode='both'/>
    )
}

export default DropdownSize