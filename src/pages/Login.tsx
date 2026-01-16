import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Link,
  Container,
  Alert,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Simulando dados do usuário (em produção viriam do backend)
  const userData = {
    agencia: '0001',
    conta: '1000001-0',
    banco: '260 - BFIN Pagamentos S.A.',
  };

  function handleTrocarUsuario() {
    setEmail('');
    setPassword('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="var(--background)"
      position="relative"
    >
      {/* Theme Toggle - Fixed top-right */}
      <Box position="absolute" top={4} right={4} zIndex={10}>
        <ThemeToggle variant="icon" size="md" />
      </Box>

      <Container maxW="md" py={{ base: "8", md: "16" }} px={{ base: "4", sm: "8" }}>
        <VStack gap="0" w="full">
          {/* Card Superior - Informações da Conta e Logo */}
          <Box
            w="full"
            bg="var(--primary)"
            borderTopRadius="2xl"
            p="8"
            position="relative"
            boxShadow="2xl"
          >
            {/* Botão Fechar */}
            <IconButton
              aria-label="Fechar"
              position="absolute"
              top="4"
              right="4"
              size="sm"
              variant="ghost"
              color="var(--primary-foreground)"
              _hover={{ bg: 'var(--accent)' }}
            >
              <MdClose />
            </IconButton>

            {/* Informações da Conta */}
            <VStack align="flex-start" gap="0" mb="12">
              <Text color="var(--primary-foreground)" fontSize="xs" opacity={0.8}>
                Agência: {userData.agencia}
              </Text>
              <Text color="var(--primary-foreground)" fontSize="xs" opacity={0.8}>
                Conta: {userData.conta}
              </Text>
              <Text color="var(--primary-foreground)" fontSize="xs" opacity={0.8}>
                Banco: {userData.banco}
              </Text>
            </VStack>

            {/* Logo */}
            <Flex justify="center" mb="12">
              <Text
                fontSize="6xl"
                fontWeight="black"
                color="var(--primary-foreground)"
                fontFamily="'Playfair Display SC', serif"
                letterSpacing="tight"
                style={{
                  textShadow: '0 0 30px rgba(255,255,255,0.2)',
                }}
              >
                BFIN
              </Text>
            </Flex>

            {/* Nome do Usuário / Email */}
            <Flex justify="space-between" align="center">
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color="var(--primary-foreground)"
                fontSize="xl"
                fontWeight="bold"
                letterSpacing="wide"
                bg="transparent"
                border="none"
                p="0"
                _placeholder={{ color: "var(--primary-foreground)", opacity: 0.6 }}
                _focus={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none"
                }}
                autoComplete="email"
              />
              <Link
                color="var(--primary-foreground)"
                fontSize="xs"
                fontWeight="medium"
                textDecoration="underline"
                _hover={{ opacity: 0.8 }}
                cursor="pointer"
                onClick={handleTrocarUsuario}
              >
                TROCAR DE USUÁRIO
              </Link>
            </Flex>
          </Box>

          {/* Card Inferior - Login */}
          <Box
            w="full"
            bg="var(--card)"
            borderBottomRadius="2xl"
            p="8"
            boxShadow="2xl"
          >
            <form onSubmit={handleSubmit}>
              <VStack gap="6" align="stretch">
                {error && (
                  <Alert.Root status="error" borderRadius="lg" variant="subtle">
                    <Alert.Indicator />
                    <Alert.Title>{error}</Alert.Title>
                  </Alert.Root>
                )}

                {/* Título */}
                <VStack align="flex-start" gap="1">
                  <Text color="var(--card-foreground)" fontSize="lg" fontWeight="bold">
                    BFIN
                  </Text>
                  <Text color="var(--muted-foreground)" fontSize="sm">
                    Desbloqueie seu app
                  </Text>
                </VStack>

                {/* Campo Senha */}
                <Box>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    bg="var(--input)"
                    borderColor="var(--border)"
                    color="var(--card-foreground)"
                    textAlign="center"
                    fontSize="2xl"
                    letterSpacing="widest"
                    _placeholder={{ color: "var(--muted-foreground)" }}
                    _focus={{
                      borderColor: "var(--accent)",
                      boxShadow: "0 0 0 1px var(--accent)"
                    }}
                    autoComplete="current-password"
                    required
                  />
                </Box>

                {/* Botão Entrar */}
                <Button
                  type="submit"
                  bg="var(--primary)"
                  color="var(--primary-foreground)"
                  _hover={{ opacity: 0.9 }}
                  size="lg"
                  fontSize="sm"
                  fontWeight="bold"
                  letterSpacing="wide"
                  loading={isLoading}
                  loadingText="Entrando..."
                >
                  ENTRAR
                </Button>

                {/* Separador */}
                <Flex align="center" gap="4" my="2">
                  <Box flex="1" h="1px" bg="var(--border)" />
                  <Text color="var(--muted-foreground)" fontSize="xs" fontWeight="medium">
                    OU
                  </Text>
                  <Box flex="1" h="1px" bg="var(--border)" />
                </Flex>

                {/* Botão Registre-se */}
                <Button
                  variant="outline"
                  size="lg"
                  fontSize="sm"
                  fontWeight="bold"
                  letterSpacing="wide"
                  borderColor="var(--primary)"
                  color="var(--primary)"
                  _hover={{
                    bg: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                  onClick={() => navigate('/register')}
                >
                  REGISTRE-SE
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}
