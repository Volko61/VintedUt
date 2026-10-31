import { Button, Group, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Doc, Id } from '../../convex/_generated/dataModel'
import DropzoneImage from './DropzoneImage'

type ItemState = NonNullable<Doc<'items'>['state']>
type ItemSize = NonNullable<Doc<'items'>['size']>

const SIZES: ItemSize[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

const STATE_OPTIONS: { value: ItemState; label: string }[] = [
  { value: 'broken', label: 'Pour pièce' },
  { value: 'bad', label: 'Mauvais état' },
  { value: 'okay', label: 'Etat moyen' },
  { value: 'good', label: 'Bon état' },
  { value: 'verygood', label: 'Très bon état' },
]

function SellForm() {
  const createItem = useMutation(api.items.create)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      price: 0,
      imageIds: [] as Id<'_storage'>[],
      size: undefined as ItemSize | undefined,
      state: undefined as ItemState | undefined,
    },
    validate: {
      title: (value) => (value.trim() ? null : 'Le titre est requis'),
      description: (value) => (value.trim() ? null : 'La description est requise'),
      price: (value) => (Number.isFinite(value) && value >= 0 ? null : 'Prix invalide'),
      imageIds: (value) => (value.length > 0 ? null : 'Ajoutez au moins une image'),
    },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await createItem(values)
      notifications.show({ color: 'green', message: 'Annonce publiée !' })
      form.reset()
    } catch (error) {
      notifications.show({
        color: 'red',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Group>
          <DropzoneImage
            error={form.errors.imageIds}
            onChange={(imageIds) => form.setFieldValue('imageIds', imageIds)}
          />
          <Stack>
            <TextInput
              withAsterisk
              label="Titre"
              placeholder="Ma casquette TUC"
              key={form.key('title')}
              {...form.getInputProps('title')}
            />
            <Select
              label="Taille"
              placeholder="XXS"
              data={SIZES}
              onChange={(size) =>
                form.setFieldValue('size', (size as ItemSize | null) ?? undefined)
              }
            />
            <Select
              label="Etat"
              placeholder="Bon état"
              data={STATE_OPTIONS}
              onChange={(state) =>
                form.setFieldValue('state', (state as ItemState | null) ?? undefined)
              }
            />
            <NumberInput
              withAsterisk
              min={0}
              decimalScale={2}
              label="Prix (€)"
              key={form.key('price')}
              {...form.getInputProps('price')}
            />
          </Stack>
        </Group>
        <Textarea
          withAsterisk
          autosize
          minRows={3}
          label="Description"
          key={form.key('description')}
          {...form.getInputProps('description')}
        />
        <Group>
          <Button type="submit" loading={form.submitting}>
            Valider
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default SellForm
