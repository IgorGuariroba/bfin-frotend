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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
    setEmailError('');
    setPasswordError('');
  }

  function validateEmail(value: string) {
    if (!value) {
      setEmailError('Campo obrigatório');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Email inválido');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  }

  function validatePassword(value: string) {
    if (!value) {
      setPasswordError('Campo obrigatório');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  }

  function validateFields() {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    return isEmailValid && isPasswordValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validar campos
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      // Redirecionamento será feito automaticamente pelo PublicRoute
      // pois o usuário agora está autenticado
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
        <form onSubmit={handleSubmit} data-testid="login-form" noValidate>
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
                css={{
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.2)', // ok: whiteAlpha.200
                }}
              >
                BFIN
              </Text>
            </Flex>

            {/* Nome do Usuário / Email */}
            <Box>
              <Flex justify="space-between" align="center">
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => validateEmail(e.target.value)}
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
                  autoComplete="username email"
                  data-testid="email-input"
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
              {emailError && (
                <Text
                  color="red.400"
                  fontSize="xs"
                  mt="1"
                  data-testid="email-error"
                >
                  {emailError}
                </Text>
              )}
            </Box>
          </Box>

          {/* Card Inferior - Login */}
          <Box
            w="full"
            bg="var(--card)"
            borderBottomRadius="2xl"
            p="8"
            boxShadow="2xl"
          >
            <VStack gap="6" align="stretch">
                {error && (
                  <Alert.Root status="error" borderRadius="lg" variant="subtle" data-testid="error-message">
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
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => validatePassword(e.target.value)}
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
                    data-testid="password-input"
                  />
                  {passwordError && (
                    <Text
                      color="red.400"
                      fontSize="xs"
                      mt="1"
                      textAlign="center"
                      data-testid="password-error"
                    >
                      {passwordError}
                    </Text>
                  )}
                </Box>

                {/* Botão Entrar */}
                <VStack gap="3" align="stretch">
                  {isLoading && (
                    <Box data-testid="login-loading" textAlign="center">
                      <Text color="var(--muted-foreground)" fontSize="sm">
                        Entrando...
                      </Text>
                    </Box>
                  )}
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
                    data-testid="login-button"
                    disabled={isLoading}
                  >
                    ENTRAR
                  </Button>
                </VStack>

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
                  data-testid="register-link"
                >
                  REGISTRE-SE
                </Button>
            </VStack>
          </Box>
          </VStack>
        </form>
      </Container>
    </Flex>
  );
}
