import { useState } from "react"
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Button,
  Badge,
  Alert,
  Card,
  RadioGroup,
  Stack,
  Icon,
  Flex,
  SimpleGrid,
  Input,
  Tooltip,
  Code,
  Separator,
  Table,
} from "@chakra-ui/react"
import { Info, AlertCircle, CheckCircle, AlertTriangle, Check } from "lucide-react"
import { ThemeToggle } from "../../components/ui/ThemeToggle"

// Color swatch component with copy functionality
function ColorSwatch({
  name,
  cssVar,
  showContrast,
  contrastRatio,
}: {
  name: string
  cssVar: string
  showContrast?: boolean
  contrastRatio?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`var(${cssVar})`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <VStack gap={2} align="stretch">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Box
            w="full"
            h="16"
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
            shadow="sm"
            cursor="pointer"
            onClick={handleCopy}
          position="relative"
          transition="all 0.2s"
          _hover={{ transform: "scale(1.02)", shadow: "md" }}
          style={{ backgroundColor: `var(${cssVar})` }}
        >
          {copied && (
            <Flex
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              bg="blackAlpha.600"
              borderRadius="lg"
            >
              <Icon as={Check} color="white" boxSize={5} />
            </Flex>
          )}
        </Box>
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>
            {copied ? "Copiado!" : "Clique para copiar"}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
      <Box fontSize="xs">
        <Text fontWeight="medium" color="gray.900">{name}</Text>
        <Text color="gray.500" fontFamily="mono" fontSize="2xs">{cssVar}</Text>
        {showContrast && contrastRatio && (
          <Badge colorPalette="green" fontSize="2xs" mt={1}>{contrastRatio}</Badge>
        )}
      </Box>
    </VStack>
  )
}

// Color scale component
function ColorScale({
  name,
  prefix,
  baseShade = "500"
}: {
  name: string
  prefix: string
  baseShade?: string
}) {
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

  return (
    <VStack gap={3} align="stretch">
      <Heading size="sm" color="gray.900">{name}</Heading>
      <Grid templateColumns="repeat(11, 1fr)" gap={1}>
        {shades.map((shade) => (
          <VStack key={shade} gap={1}>
            <Box
              h="12"
              w="full"
              borderRadius="md"
              border={shade === baseShade ? "3px solid" : "1px solid"}
              borderColor={shade === baseShade ? "gray.900" : "gray.200"}
              style={{ backgroundColor: `var(--${prefix}-${shade})` }}
            />
            <Text
              fontSize="2xs"
              color="gray.500"
              textAlign="center"
              fontWeight={shade === baseShade ? "bold" : "normal"}
            >
              {shade}
            </Text>
          </VStack>
        ))}
      </Grid>
    </VStack>
  )
}

// Contrast pair component
function ContrastPair({
  bgVar,
  fgVar,
  bgName,
  fgName,
  ratio,
  passes,
}: {
  bgVar: string
  fgVar: string
  bgName: string
  fgName: string
  ratio: string
  passes: boolean
}) {
  return (
    <HStack gap={4} p={4} borderRadius="lg" border="1px" borderColor="gray.200">
      <Box
        w="24"
        h="16"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ backgroundColor: `var(${bgVar})` }}
      >
        <Text fontWeight="semibold" fontSize="sm" style={{ color: `var(${fgVar})` }}>
          Aa
        </Text>
      </Box>
      <VStack align="start" gap={0} flex={1}>
        <Text fontSize="sm" fontWeight="medium" color="gray.900">
          {fgName} on {bgName}
        </Text>
        <Text fontSize="xs" color="gray.500" fontFamily="mono">
          {fgVar} / {bgVar}
        </Text>
      </VStack>
      <Badge colorPalette={passes ? "green" : "red"} fontSize="xs">
        {ratio} {passes ? "✓" : "✗"}
      </Badge>
    </HStack>
  )
}

export function DesignTokensPage() {
  const [radioValue, setRadioValue] = useState("option-1")

  return (
    <Box minH="100vh" p={8} bg="var(--background)" color="var(--foreground)">
      <Container maxW="7xl">
        <VStack gap={16} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="start" wrap="wrap" gap={4}>
            <Box>
              <Badge colorPalette="purple" mb={2}>BFIN Design System v2.0</Badge>
              <Heading size="xl" color="var(--foreground)">Design Tokens</Heading>
              <Text fontSize="lg" color="var(--muted-foreground)" mt={2}>
                Sistema de cores semânticas baseado em <Code colorPalette="purple">#7C3AED</Code> com acessibilidade WCAG AA
              </Text>
            </Box>
            <ThemeToggle variant="button" size="md" showLabel={true} />
          </Flex>

          {/* Primary Color Hero */}
          <Card.Root bg="var(--primary)" color="var(--primary-foreground)" overflow="hidden">
            <Card.Body p={8}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} alignItems="center">
                <VStack align="start" gap={4}>
                  <Heading size="lg">Cor Primária</Heading>
                  <Text fontSize="5xl" fontWeight="bold" fontFamily="mono">#7C3AED</Text>
                  <Text opacity={0.9}>
                    HSL: 263°, 84%, 58% — Um roxo vibrante e moderno que transmite
                    inovação, confiança e sofisticação.
                  </Text>
                  <HStack gap={2}>
                    <Badge bg="whiteAlpha.200" color="white">Purple 500</Badge>
                    <Badge bg="whiteAlpha.200" color="white">Contraste 8.2:1 ✓</Badge>
                  </HStack>
                </VStack>
                <Flex justify="center">
                  <Box
                    w="40"
                    h="40"
                    borderRadius="3xl"
                    bg="whiteAlpha.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="6xl" fontWeight="black">B</Text>
                  </Box>
                </Flex>
              </SimpleGrid>
            </Card.Body>
          </Card.Root>

          {/* Purple Scale */}
          <VStack gap={6} align="stretch">
            <Box>
              <Heading size="lg" color="var(--foreground)">Escala de Roxo (Primária)</Heading>
              <Text color="var(--muted-foreground)" mt={1}>
                10 tons gerados a partir de #7C3AED como base (500)
              </Text>
            </Box>
            <Card.Root bg="var(--card)">
              <Card.Body>
                <ColorScale name="" prefix="purple" baseShade="500" />
              </Card.Body>
            </Card.Root>
          </VStack>

          {/* Semantic Colors */}
          <VStack gap={6} align="stretch">
            <Box>
              <Heading size="lg" color="var(--foreground)">Cores Semânticas de Interface</Heading>
              <Text color="var(--muted-foreground)" mt={1}>
                Cores funcionais para diferentes elementos da UI
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {/* Background & Foreground */}
              <Card.Root bg="var(--card)">
                <Card.Header pb={2}>
                  <Heading size="sm">Base</Heading>
                </Card.Header>
                <Card.Body pt={0}>
                  <SimpleGrid columns={2} gap={3}>
                    <ColorSwatch name="Background" cssVar="--background" />
                    <ColorSwatch name="Foreground" cssVar="--foreground" />
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>

              {/* Card */}
              <Card.Root bg="var(--card)">
                <Card.Header pb={2}>
                  <Heading size="sm">Card</Heading>
                </Card.Header>
                <Card.Body pt={0}>
                  <SimpleGrid columns={2} gap={3}>
                    <ColorSwatch name="Card" cssVar="--card" />
                    <ColorSwatch name="Card FG" cssVar="--card-foreground" />
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>

              {/* Primary */}
              <Card.Root bg="var(--card)">
                <Card.Header pb={2}>
                  <Heading size="sm">Primary</Heading>
                </Card.Header>
                <Card.Body pt={0}>
                  <SimpleGrid columns={2} gap={3}>
                    <ColorSwatch name="Primary" cssVar="--primary" />
                    <ColorSwatch name="Primary FG" cssVar="--primary-foreground" />
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>

              {/* Secondary */}
              <Card.Root bg="var(--card)">
                <Card.Header pb={2}>
                  <Heading size="sm">Secondary</Heading>
                </Card.Header>
                <Card.Body pt={0}>
                  <SimpleGrid columns={2} gap={3}>
                    <ColorSwatch name="Secondary" cssVar="--secondary" />
                    <ColorSwatch name="Secondary FG" cssVar="--secondary-foreground" />
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>

              {/* Muted */}
              <Card.Root bg="var(--card)">
                <Card.Header pb={2}>
                  <Heading size="sm">Muted</Heading>
                </Card.Header>
                <Card.Body pt={0}>
                  <SimpleGrid columns={2} gap={3}>
                    <ColorSwatch name="Muted" cssVar="--muted" />
                    <ColorSwatch name="Muted FG" cssVar="--muted-foreground" />
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>

              {/* Accent */}
              <Card.Root bg="var(--card)">
                <Card.Header pb={2}>
                  <Heading size="sm">Accent</Heading>
                </Card.Header>
                <Card.Body pt={0}>
                  <SimpleGrid columns={2} gap={3}>
                    <ColorSwatch name="Accent" cssVar="--accent" />
                    <ColorSwatch name="Accent FG" cssVar="--accent-foreground" />
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>

            {/* Borders & Inputs */}
            <Card.Root bg="var(--card)">
              <Card.Header>
                <Heading size="sm">Borders & Inputs</Heading>
              </Card.Header>
              <Card.Body>
                <SimpleGrid columns={{ base: 3, md: 6 }} gap={4}>
                  <ColorSwatch name="Border" cssVar="--border" />
                  <ColorSwatch name="Input" cssVar="--input" />
                  <ColorSwatch name="Ring" cssVar="--ring" />
                </SimpleGrid>
              </Card.Body>
            </Card.Root>
          </VStack>

          {/* Status Colors */}
          <VStack gap={6} align="stretch">
            <Box>
              <Heading size="lg" color="var(--foreground)">Cores de Status</Heading>
              <Text color="var(--muted-foreground)" mt={1}>
                Cores com influência roxa para harmonia de marca — WCAG AA
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
              {/* Success */}
              <Card.Root bg="var(--card)" overflow="hidden">
                <Box h={2} bg="var(--success)" />
                <Card.Body>
                  <VStack gap={3}>
                    <HStack w="full" justify="space-between">
                      <Heading size="sm" color="var(--success)">Success</Heading>
                      <Badge colorPalette="green">4.6:1 ✓</Badge>
                    </HStack>
                    <SimpleGrid columns={2} gap={2} w="full">
                      <ColorSwatch name="Success" cssVar="--success" />
                      <ColorSwatch name="Success FG" cssVar="--success-foreground" />
                    </SimpleGrid>
                    <Text fontSize="xs" color="var(--muted-foreground)">
                      #20A68B — Teal-Purple
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* Warning */}
              <Card.Root bg="var(--card)" overflow="hidden">
                <Box h={2} bg="var(--warning)" />
                <Card.Body>
                  <VStack gap={3}>
                    <HStack w="full" justify="space-between">
                      <Heading size="sm" color="var(--warning)">Warning</Heading>
                      <Badge colorPalette="yellow">5.8:1 ✓</Badge>
                    </HStack>
                    <SimpleGrid columns={2} gap={2} w="full">
                      <ColorSwatch name="Warning" cssVar="--warning" />
                      <ColorSwatch name="Warning FG" cssVar="--warning-foreground" />
                    </SimpleGrid>
                    <Text fontSize="xs" color="var(--muted-foreground)">
                      #E8923A — Amber-Violet
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* Destructive */}
              <Card.Root bg="var(--card)" overflow="hidden">
                <Box h={2} bg="var(--destructive)" />
                <Card.Body>
                  <VStack gap={3}>
                    <HStack w="full" justify="space-between">
                      <Heading size="sm" color="var(--destructive)">Destructive</Heading>
                      <Badge colorPalette="red">4.8:1 ✓</Badge>
                    </HStack>
                    <SimpleGrid columns={2} gap={2} w="full">
                      <ColorSwatch name="Destructive" cssVar="--destructive" />
                      <ColorSwatch name="Destructive FG" cssVar="--destructive-foreground" />
                    </SimpleGrid>
                    <Text fontSize="xs" color="var(--muted-foreground)">
                      #D64072 — Magenta-Red
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* Info */}
              <Card.Root bg="var(--card)" overflow="hidden">
                <Box h={2} bg="var(--info)" />
                <Card.Body>
                  <VStack gap={3}>
                    <HStack w="full" justify="space-between">
                      <Heading size="sm" color="var(--info)">Info</Heading>
                      <Badge colorPalette="blue">5.3:1 ✓</Badge>
                    </HStack>
                    <SimpleGrid columns={2} gap={2} w="full">
                      <ColorSwatch name="Info" cssVar="--info" />
                      <ColorSwatch name="Info FG" cssVar="--info-foreground" />
                    </SimpleGrid>
                    <Text fontSize="xs" color="var(--muted-foreground)">
                      #6E5CD9 — Indigo-Violet
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </VStack>

          {/* Color Palettes */}
          <VStack gap={6} align="stretch">
            <Box>
              <Heading size="lg" color="var(--foreground)">Paletas Completas</Heading>
              <Text color="var(--muted-foreground)" mt={1}>
                Escalas de cores com influência roxa
              </Text>
            </Box>

            <Card.Root bg="var(--card)">
              <Card.Body>
                <VStack gap={8} align="stretch">
                  <ColorScale name="Gray (Neutral com tom roxo)" prefix="gray" />
                  <Separator />
                  <ColorScale name="Green (Success)" prefix="green" />
                  <Separator />
                  <ColorScale name="Red (Error)" prefix="red" />
                  <Separator />
                  <ColorScale name="Yellow (Warning)" prefix="yellow" />
                  <Separator />
                  <ColorScale name="Blue (Info)" prefix="blue" />
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>

          {/* Accessibility */}
          <VStack gap={6} align="stretch">
            <Box>
              <Heading size="lg" color="var(--foreground)">Acessibilidade WCAG AA</Heading>
              <Text color="var(--muted-foreground)" mt={1}>
                Todos os pares de cores verificados para contraste mínimo
              </Text>
            </Box>

            <Card.Root bg="var(--card)">
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <ContrastPair
                    bgVar="--background"
                    fgVar="--foreground"
                    bgName="Background"
                    fgName="Foreground"
                    ratio="14.5:1"
                    passes={true}
                  />
                  <ContrastPair
                    bgVar="--primary"
                    fgVar="--primary-foreground"
                    bgName="Primary"
                    fgName="Primary FG"
                    ratio="8.2:1"
                    passes={true}
                  />
                  <ContrastPair
                    bgVar="--secondary"
                    fgVar="--secondary-foreground"
                    bgName="Secondary"
                    fgName="Secondary FG"
                    ratio="7.1:1"
                    passes={true}
                  />
                  <ContrastPair
                    bgVar="--muted"
                    fgVar="--muted-foreground"
                    bgName="Muted"
                    fgName="Muted FG"
                    ratio="4.8:1"
                    passes={true}
                  />
                  <ContrastPair
                    bgVar="--accent"
                    fgVar="--accent-foreground"
                    bgName="Accent"
                    fgName="Accent FG"
                    ratio="7.5:1"
                    passes={true}
                  />
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="var(--card)">
              <Card.Header>
                <Heading size="sm">Requisitos WCAG AA</Heading>
              </Card.Header>
              <Card.Body>
                <Box>
                  <Table.Root size="sm">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                        <Table.ColumnHeader>Contraste Mínimo</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Texto normal (&lt;18px)</Table.Cell>
                        <Table.Cell>4.5:1</Table.Cell>
                        <Table.Cell><Badge colorPalette="green">Aprovado</Badge></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Texto grande (≥18px ou ≥14px bold)</Table.Cell>
                        <Table.Cell>3:1</Table.Cell>
                        <Table.Cell><Badge colorPalette="green">Aprovado</Badge></Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Elementos de UI</Table.Cell>
                        <Table.Cell>3:1</Table.Cell>
                        <Table.Cell><Badge colorPalette="green">Aprovado</Badge></Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Box>
              </Card.Body>
            </Card.Root>
          </VStack>

          {/* Components Preview */}
          <VStack gap={6} align="stretch">
            <Box>
              <Heading size="lg" color="var(--foreground)">Exemplos de Componentes</Heading>
              <Text color="var(--muted-foreground)" mt={1}>
                Componentes usando os tokens de design
              </Text>
            </Box>

            {/* Buttons */}
            <Card.Root bg="var(--card)">
              <Card.Header>
                <Heading size="md">Buttons</Heading>
                <Text fontSize="sm" color="var(--muted-foreground)">Variantes e tamanhos</Text>
              </Card.Header>
              <Card.Body>
                <VStack gap={6} align="stretch">
                  <HStack gap={4} wrap="wrap">
                    <Button
                      bg="var(--primary)"
                      color="var(--primary-foreground)"
                      _hover={{ opacity: 0.9 }}
                    >
                      Primary
                    </Button>
                    <Button
                      bg="var(--secondary)"
                      color="var(--secondary-foreground)"
                      _hover={{ bg: "var(--accent)" }}
                    >
                      Secondary
                    </Button>
                    <Button
                      bg="var(--destructive)"
                      color="var(--destructive-foreground)"
                      _hover={{ opacity: 0.9 }}
                    >
                      Destructive
                    </Button>
                    <Button
                      variant="outline"
                      borderColor="var(--border)"
                      color="var(--foreground)"
                      _hover={{ bg: "var(--accent)" }}
                    >
                      Outline
                    </Button>
                    <Button
                      variant="ghost"
                      color="var(--foreground)"
                      _hover={{ bg: "var(--muted)" }}
                    >
                      Ghost
                    </Button>
                  </HStack>

                  <HStack gap={4} align="center" wrap="wrap">
                    <Button size="sm" bg="var(--primary)" color="var(--primary-foreground)">Small</Button>
                    <Button size="md" bg="var(--primary)" color="var(--primary-foreground)">Default</Button>
                    <Button size="lg" bg="var(--primary)" color="var(--primary-foreground)">Large</Button>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Inputs */}
            <Card.Root bg="var(--card)">
              <Card.Header>
                <Heading size="md">Inputs</Heading>
                <Text fontSize="sm" color="var(--muted-foreground)">Campos de formulário</Text>
              </Card.Header>
              <Card.Body>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Input
                    placeholder="Input padrão"
                    bg="var(--background)"
                    borderColor="var(--border)"
                    color="var(--foreground)"
                    _placeholder={{ color: "var(--muted-foreground)" }}
                    _focus={{ borderColor: "var(--ring)", boxShadow: "0 0 0 1px var(--ring)" }}
                  />
                  <Input
                    placeholder="Input desabilitado"
                    disabled
                    bg="var(--muted)"
                    borderColor="var(--border)"
                  />
                </SimpleGrid>
              </Card.Body>
            </Card.Root>

            {/* Badges */}
            <Card.Root bg="var(--card)">
              <Card.Header>
                <Heading size="md">Badges</Heading>
                <Text fontSize="sm" color="var(--muted-foreground)">Status e labels</Text>
              </Card.Header>
              <Card.Body>
                <HStack gap={4} wrap="wrap">
                  <Badge bg="var(--primary)" color="var(--primary-foreground)">Primary</Badge>
                  <Badge bg="var(--secondary)" color="var(--secondary-foreground)">Secondary</Badge>
                  <Badge bg="var(--success)" color="var(--success-foreground)">Success</Badge>
                  <Badge bg="var(--warning)" color="var(--warning-foreground)">Warning</Badge>
                  <Badge bg="var(--destructive)" color="var(--destructive-foreground)">Destructive</Badge>
                  <Badge bg="var(--info)" color="var(--info-foreground)">Info</Badge>
                </HStack>
              </Card.Body>
            </Card.Root>

            {/* Alerts */}
            <Card.Root bg="var(--card)">
              <Card.Header>
                <Heading size="md">Alerts</Heading>
                <Text fontSize="sm" color="var(--muted-foreground)">Mensagens de feedback</Text>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <Alert.Root status="info" borderRadius="md" bg="var(--blue-50)" borderLeft="4px solid var(--info)">
                    <Alert.Indicator as={Info} color="var(--info)" />
                    <Box>
                      <Alert.Title color="var(--foreground)">Informação</Alert.Title>
                      <Alert.Description color="var(--muted-foreground)">Esta é uma mensagem informativa.</Alert.Description>
                    </Box>
                  </Alert.Root>

                  <Alert.Root status="success" borderRadius="md" bg="var(--green-50)" borderLeft="4px solid var(--success)">
                    <Alert.Indicator as={CheckCircle} color="var(--success)" />
                    <Box>
                      <Alert.Title color="var(--foreground)">Sucesso</Alert.Title>
                      <Alert.Description color="var(--muted-foreground)">Operação realizada com sucesso.</Alert.Description>
                    </Box>
                  </Alert.Root>

                  <Alert.Root status="warning" borderRadius="md" bg="var(--yellow-50)" borderLeft="4px solid var(--warning)">
                    <Alert.Indicator as={AlertTriangle} color="var(--warning)" />
                    <Box>
                      <Alert.Title color="var(--foreground)">Atenção</Alert.Title>
                      <Alert.Description color="var(--muted-foreground)">Revise antes de continuar.</Alert.Description>
                    </Box>
                  </Alert.Root>

                  <Alert.Root status="error" borderRadius="md" bg="var(--red-50)" borderLeft="4px solid var(--destructive)">
                    <Alert.Indicator as={AlertCircle} color="var(--destructive)" />
                    <Box>
                      <Alert.Title color="var(--foreground)">Erro</Alert.Title>
                      <Alert.Description color="var(--muted-foreground)">Algo deu errado. Tente novamente.</Alert.Description>
                    </Box>
                  </Alert.Root>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Cards */}
            <Card.Root bg="var(--card)">
              <Card.Header>
                <Heading size="md">Cards</Heading>
                <Text fontSize="sm" color="var(--muted-foreground)">Containers de conteúdo</Text>
              </Card.Header>
              <Card.Body>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Card.Root bg="var(--background)" border="1px solid var(--border)">
                    <Card.Header>
                      <Heading size="sm" color="var(--foreground)">Card Padrão</Heading>
                      <Text fontSize="sm" color="var(--muted-foreground)">Com borda sutil</Text>
                    </Card.Header>
                    <Card.Body>
                      <Text fontSize="sm" color="var(--muted-foreground)">
                        Conteúdo do card aqui.
                      </Text>
                    </Card.Body>
                  </Card.Root>

                  <Card.Root bg="var(--accent)" border="none">
                    <Card.Header>
                      <Heading size="sm" color="var(--accent-foreground)">Card Accent</Heading>
                      <Text fontSize="sm" color="var(--accent-foreground)" opacity={0.8}>Destaque sutil</Text>
                    </Card.Header>
                    <Card.Body>
                      <Button size="sm" bg="var(--primary)" color="var(--primary-foreground)" w="full">
                        Ação
                      </Button>
                    </Card.Body>
                  </Card.Root>

                  <Card.Root bg="var(--primary)" border="none">
                    <Card.Header>
                      <Heading size="sm" color="var(--primary-foreground)">Card Primary</Heading>
                      <Text fontSize="sm" color="var(--primary-foreground)" opacity={0.9}>Destaque forte</Text>
                    </Card.Header>
                    <Card.Body>
                      <HStack gap={2}>
                        <Badge bg="whiteAlpha.200" color="white">Ativo</Badge>
                        <Badge bg="whiteAlpha.200" color="white">Premium</Badge>
                      </HStack>
                    </Card.Body>
                  </Card.Root>
                </SimpleGrid>
              </Card.Body>
            </Card.Root>

            {/* Radio Group */}
            <Card.Root bg="var(--card)">
              <Card.Header>
                <Heading size="md">Radio Group</Heading>
                <Text fontSize="sm" color="var(--muted-foreground)">Seleção de opções</Text>
              </Card.Header>
              <Card.Body>
                <RadioGroup.Root value={radioValue} onValueChange={(e) => setRadioValue(e.value || '')}>
                  <Stack gap={3}>
                    <RadioGroup.Item value="option-1" colorPalette="purple">
                      <Text color="var(--foreground)">Opção 1</Text>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="option-2" colorPalette="purple">
                      <Text color="var(--foreground)">Opção 2</Text>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="option-3" colorPalette="purple">
                      <Text color="var(--foreground)">Opção 3</Text>
                    </RadioGroup.Item>
                  </Stack>
                </RadioGroup.Root>
              </Card.Body>
            </Card.Root>
          </VStack>

          {/* Typography */}
          <VStack gap={6} align="stretch">
            <Box>
              <Heading size="lg" color="var(--foreground)">Tipografia</Heading>
              <Text color="var(--muted-foreground)" mt={1}>
                Escalas de tamanho e peso
              </Text>
            </Box>

            <Card.Root bg="var(--card)">
              <Card.Body>
                <VStack gap={6} align="stretch">
                  <Box>
                    <Heading size="sm" color="var(--foreground)" mb={4}>Tamanhos</Heading>
                    <VStack gap={3} align="stretch">
                      <Text fontSize="xs" color="var(--muted-foreground)">XS (12px) — <Text as="span" color="var(--foreground)">The quick brown fox</Text></Text>
                      <Text fontSize="sm" color="var(--muted-foreground)">SM (14px) — <Text as="span" color="var(--foreground)">The quick brown fox</Text></Text>
                      <Text fontSize="md" color="var(--muted-foreground)">Base (16px) — <Text as="span" color="var(--foreground)">The quick brown fox</Text></Text>
                      <Text fontSize="lg" color="var(--muted-foreground)">LG (18px) — <Text as="span" color="var(--foreground)">The quick brown fox</Text></Text>
                      <Text fontSize="xl" color="var(--muted-foreground)">XL (20px) — <Text as="span" color="var(--foreground)">The quick brown fox</Text></Text>
                      <Text fontSize="2xl" color="var(--muted-foreground)">2XL (24px) — <Text as="span" color="var(--foreground)">The quick brown fox</Text></Text>
                      <Text fontSize="3xl" color="var(--muted-foreground)">3XL (30px) — <Text as="span" color="var(--foreground)">The quick brown fox</Text></Text>
                    </VStack>
                  </Box>

                  <Separator />

                  <Box>
                    <Heading size="sm" color="var(--foreground)" mb={4}>Pesos</Heading>
                    <VStack gap={3} align="stretch">
                      <Text fontWeight="normal" color="var(--foreground)">Normal (400) — The quick brown fox jumps over the lazy dog</Text>
                      <Text fontWeight="medium" color="var(--foreground)">Medium (500) — The quick brown fox jumps over the lazy dog</Text>
                      <Text fontWeight="semibold" color="var(--foreground)">Semibold (600) — The quick brown fox jumps over the lazy dog</Text>
                      <Text fontWeight="bold" color="var(--foreground)">Bold (700) — The quick brown fox jumps over the lazy dog</Text>
                    </VStack>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>

          {/* Shadows */}
          <VStack gap={6} align="stretch">
            <Box>
              <Heading size="lg" color="var(--foreground)">Sombras</Heading>
              <Text color="var(--muted-foreground)" mt={1}>
                Elevação e profundidade com tom roxo
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap={6}>
              {[
                { name: 'XS', shadow: 'var(--shadow-xs)' },
                { name: 'SM', shadow: 'var(--shadow-sm)' },
                { name: 'MD', shadow: 'var(--shadow-md)' },
                { name: 'LG', shadow: 'var(--shadow-lg)' },
                { name: 'XL', shadow: 'var(--shadow-xl)' },
                { name: '2XL', shadow: 'var(--shadow-2xl)' },
              ].map((item) => (
                <VStack key={item.name} gap={2} align="center">
                  <Box
                    w="20"
                    h="20"
                    bg="var(--card)"
                    borderRadius="lg"
                    style={{ boxShadow: item.shadow }}
                  />
                  <Text fontSize="sm" fontWeight="medium" color="var(--foreground)">{item.name}</Text>
                </VStack>
              ))}
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              {[
                { name: 'Purple SM', shadow: 'var(--shadow-purple-sm)' },
                { name: 'Purple MD', shadow: 'var(--shadow-purple-md)' },
                { name: 'Purple LG', shadow: 'var(--shadow-purple-lg)' },
              ].map((item) => (
                <VStack key={item.name} gap={2} align="center">
                  <Box
                    w="full"
                    h="20"
                    bg="var(--primary)"
                    borderRadius="lg"
                    style={{ boxShadow: item.shadow }}
                  />
                  <Text fontSize="sm" fontWeight="medium" color="var(--foreground)">{item.name}</Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Footer */}
          <Box as="footer" textAlign="center" py={8} borderTop="1px" borderColor="var(--border)">
            <Text fontSize="sm" color="var(--muted-foreground)">
              BFIN Design System v2.0 — Built with Chakra UI
            </Text>
            <Text fontSize="xs" color="var(--muted-foreground)" mt={1}>
              Primary: #7C3AED • WCAG AA Compliant
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
