import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Flex,
  Alert,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Dados bancários estáticos
  const bankData = {
    agencia: '0001',
    conta: '1000001-0',
    banco: '260 - BFIN Pagamentos S.A.',
  };

  function validateName(value: string) {
    if (!value.trim()) {
      setNameError('Campo obrigatório');
      return false;
    } else {
      setNameError('');
      return true;
    }
  }

  function validateEmail(value: string) {
    if (!value.trim()) {
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
    } else if (value.length < 6) {
      setPasswordError('A senha deve ter no mínimo de 6 caracteres');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  }

  function validateConfirmPassword(value: string) {
    if (!value) {
      setConfirmPasswordError('Campo obrigatório');
      return false;
    } else if (value !== password) {
      setConfirmPasswordError('Senhas não coincidem');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  }

  function validateAllFields() {
    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    return isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validar todos os campos
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, fullName);

      // Mostrar mensagem de sucesso - o PublicRoute redirecionará automaticamente
      setShowSuccess(true);

      // Redirecionamento será feito automaticamente pelo PublicRoute
      // pois o usuário agora está autenticado
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
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

      <Box
        w="full"
        maxW={{ base: "full", sm: "400px" }}
        mx="auto"
        px={{ base: "4", sm: "0" }}
      >
        <VStack gap="0" w="full">
          {/* Card Superior - Verde com informações bancárias e logo */}
          <Box
            w="full"
            bg="var(--primary)"
            borderTopRadius={{ base: "0", sm: "3xl" }}
            p={{ base: "6", sm: "8" }}
            pt={{ base: "8", sm: "10" }}
            position="relative"
          >
            {/* Informações Bancárias */}
            <VStack align="flex-start" gap="0" mb="8">
              <Text
                color="var(--primary-foreground)"
                fontSize="xs"
                opacity={0.9}
                fontWeight="medium"
              >
                Agência: {bankData.agencia}
              </Text>
              <Text
                color="var(--primary-foreground)"
                fontSize="xs"
                opacity={0.9}
                fontWeight="medium"
              >
                Conta: {bankData.conta}
              </Text>
              <Text
                color="var(--primary-foreground)"
                fontSize="xs"
                opacity={0.9}
                fontWeight="medium"
              >
                Banco: {bankData.banco}
              </Text>
            </VStack>

            {/* Logo BFIN */}
            <Flex justify="center" py="6">
              <Text
                fontSize={{ base: "5xl", sm: "6xl" }}
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
          </Box>

          {/* Card Inferior - Branco com formulário */}
          <Box
            w="full"
            bg="var(--card)"
            borderBottomRadius={{ base: "0", sm: "3xl" }}
            p={{ base: "6", sm: "8" }}
            boxShadow={{ base: "none", sm: "2xl" }}
          >
            <form onSubmit={handleSubmit} data-testid="register-form" noValidate>
              <VStack gap="6" align="stretch">
                {/* Título */}
                <Text
                  color="var(--card-foreground)"
                  fontSize="2xl"
                  fontWeight="bold"
                  textAlign="left"
                >
                  Cadastro
                </Text>

                {error && (
                  <Box
                    p="3"
                    bg="var(--destructive)"
                    color="var(--destructive-foreground)"
                    borderRadius="lg"
                    fontSize="sm"
                    data-testid="error-message"
                  >
                    {error}
                  </Box>
                )}

                {showSuccess && (
                  <Alert.Root status="success" borderRadius="lg" variant="subtle" data-testid="success-message">
                    <Alert.Indicator />
                    <Alert.Title>Conta criada com sucesso</Alert.Title>
                    <Alert.Description>
                      Redirecionando para o dashboard...
                    </Alert.Description>
                  </Alert.Root>
                )}

                {/* Campo Nome Completo */}
                <VStack align="stretch" gap="2">
                  <Text
                    color="var(--muted-foreground)"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Nome Completo
                  </Text>
                  <Input
                    type="text"
                    placeholder="João Silva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={(e) => validateName(e.target.value)}
                    size="lg"
                    bg="var(--background)"
                    borderColor="var(--border)"
                    color="var(--card-foreground)"
                    _placeholder={{ color: "var(--muted-foreground)", opacity: 0.6 }}
                    _focus={{
                      borderColor: "var(--primary)",
                      boxShadow: "0 0 0 1px var(--primary)"
                    }}
                    autoComplete="name"
                    data-testid="name-input"
                  />
                  {nameError && (
                    <Text
                      color="red.400"
                      fontSize="xs"
                      mt="1"
                      data-testid="name-error"
                    >
                      {nameError}
                    </Text>
                  )}
                </VStack>

                {/* Campo E-mail */}
                <VStack align="stretch" gap="2">
                  <Text
                    color="var(--muted-foreground)"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    E-mail
                  </Text>
                  <Input
                    type="email"
                    placeholder="joao.silva@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => validateEmail(e.target.value)}
                    size="lg"
                    bg="var(--background)"
                    borderColor="var(--border)"
                    color="var(--card-foreground)"
                    _placeholder={{ color: "var(--muted-foreground)", opacity: 0.6 }}
                    _focus={{
                      borderColor: "var(--primary)",
                      boxShadow: "0 0 0 1px var(--primary)"
                    }}
                    autoComplete="email"
                    data-testid="email-input"
                  />
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
                </VStack>

                {/* Campo Senha */}
                <VStack align="stretch" gap="2">
                  <Text
                    color="var(--muted-foreground)"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Senha
                  </Text>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => validatePassword(e.target.value)}
                    size="lg"
                    bg="var(--background)"
                    borderColor="var(--border)"
                    color="var(--card-foreground)"
                    _placeholder={{ color: "var(--muted-foreground)", opacity: 0.6 }}
                    _focus={{
                      borderColor: "var(--primary)",
                      boxShadow: "0 0 0 1px var(--primary)"
                    }}
                    autoComplete="new-password"
                    data-testid="password-input"
                  />
                  {passwordError && (
                    <Text
                      color="red.400"
                      fontSize="xs"
                      mt="1"
                      data-testid="password-error"
                    >
                      {passwordError}
                    </Text>
                  )}
                </VStack>

                {/* Campo Confirmar Senha */}
                <VStack align="stretch" gap="2">
                  <Text
                    color="var(--muted-foreground)"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Confirmar Senha
                  </Text>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={(e) => validateConfirmPassword(e.target.value)}
                    size="lg"
                    bg="var(--background)"
                    borderColor="var(--border)"
                    color="var(--card-foreground)"
                    _placeholder={{ color: "var(--muted-foreground)", opacity: 0.6 }}
                    _focus={{
                      borderColor: "var(--primary)",
                      boxShadow: "0 0 0 1px var(--primary)"
                    }}
                    autoComplete="new-password"
                    data-testid="confirm-password-input"
                  />
                  {confirmPasswordError && (
                    <Text
                      color="red.400"
                      fontSize="xs"
                      mt="1"
                      data-testid="confirm-password-error"
                    >
                      {confirmPasswordError}
                    </Text>
                  )}
                </VStack>

                {/* Botão Cadastrar */}
                <VStack gap="3" align="stretch">
                  {isLoading && (
                    <Box data-testid="register-loading" textAlign="center">
                      <Text color="var(--muted-foreground)" fontSize="sm">
                        Cadastrando...
                      </Text>
                    </Box>
                  )}
                  <Button
                    type="submit"
                    bg="var(--primary)"
                    color="var(--primary-foreground)"
                    _hover={{ opacity: 0.9 }}
                    size="lg"
                    fontSize="md"
                    fontWeight="bold"
                    letterSpacing="wide"
                    loading={isLoading}
                    loadingText="CADASTRANDO..."
                    disabled={isLoading}
                    mt="2"
                    w="full"
                    data-testid="register-button"
                  >
                    CADASTRAR
                  </Button>

                  {/* Link para Login */}
                  <Text textAlign="center" color="var(--muted-foreground)" fontSize="sm">
                    Já tem uma conta?{' '}
                    <Text
                      as="span"
                      color="var(--primary)"
                      cursor="pointer"
                      textDecoration="underline"
                      onClick={() => navigate('/login')}
                      data-testid="login-link"
                    >
                      Faça login
                    </Text>
                  </Text>
                </VStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}
