import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Dados bancários estáticos
  const bankData = {
    agencia: '0001',
    conta: '1000001-0',
    banco: '260 - BFIN Pagamentos S.A.',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, fullName);
      navigate('/dashboard');
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
            <form onSubmit={handleSubmit}>
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
                  >
                    {error}
                  </Box>
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
                    required
                  />
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
                    required
                  />
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
                    required
                  />
                </VStack>

                {/* Botão Cadastrar */}
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
                  mt="2"
                  w="full"
                >
                  CADASTRAR
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}
