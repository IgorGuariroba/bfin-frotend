# Chakra UI v3 - Guia Completo

## Props Renomeadas (Crítico!)

```tsx
// ❌ V2 → ✅ V3
isOpen → open
isDisabled → disabled
isInvalid → invalid
isRequired → required
isLoading → loading
colorScheme → colorPalette
spacing → gap
```

## Componentes Compostos

### Dialog (Modal)
```tsx
// ❌ V2
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Título</ModalHeader>
  </ModalContent>
</Modal>

// ✅ V3
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Backdrop />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Título</Dialog.Title>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```

### Table
```tsx
// ✅ V3
<Table.Root variant="line">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Header</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Cell</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### Menu
```tsx
// ✅ V3
<Menu.Root>
  <Menu.Trigger>
    <Button>Menu</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item>Item 1</Menu.Item>
    <Menu.Item>Item 2</Menu.Item>
  </Menu.Content>
</Menu.Root>
```

## Toaster (Importante!)

```tsx
// ❌ V2
const toast = useToast()
toast({ title: "Sucesso", status: "success" })

// ✅ V3
import { toaster } from "./components/ui/toaster"

toaster.create({
  title: "Sucesso!",
  type: "success",        // não "status"
  placement: "top-end",   // não "position"
})
```

## Ícones em Botões

```tsx
// ❌ V2
<Button leftIcon={<Mail />} rightIcon={<Arrow />}>
  Email
</Button>

// ✅ V3
<Button>
  <Mail /> Email <Arrow />
</Button>
```

## Importações Corretas

### Do @chakra-ui/react
```tsx
import {
  Button, Input, Box, Flex, Stack, HStack, VStack,
  Text, Heading, Card, Field, Table, Avatar,
  Alert, NativeSelect, Tabs, Textarea, Separator
} from '@chakra-ui/react'
```

### De components/ui (relativos)
```tsx
import { Provider } from './components/ui/provider'
import { Toaster, toaster } from './components/ui/toaster'
import { Tooltip } from './components/ui/tooltip'
import { PasswordInput } from './components/ui/password-input'
```

## Field (Formulários)

```tsx
// ✅ V3
<Field.Root invalid={!!errors.email}>
  <Field.Label>Email</Field.Label>
  <Input {...register('email')} />
  {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
</Field.Root>
```

## Theme & Colors

```tsx
// Paleta principal: orange
<Button colorPalette="orange">Salvar</Button>

// Cores disponíveis
colorPalette="orange" | "blue" | "green" | "red" | "gray"
```

## ⚠️ Proibições V3

- **❌ NUNCA use `@emotion/styled`** - removido no v3
- **❌ NUNCA use `useToast()`** - use `toaster.create()`
- **❌ NUNCA use props V2** - sempre converta para V3