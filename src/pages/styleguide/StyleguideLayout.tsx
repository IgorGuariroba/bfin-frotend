import { Link as RouterLink, useLocation, Outlet } from "react-router-dom"
import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  Icon,
} from "@chakra-ui/react"
import { ArrowLeft } from "lucide-react"
import { navigation } from "./navigation"

export function StyleguideLayout() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <Flex minH="100vh">
      {/* Sidebar - Fixed */}
      <Box
        as="aside"
        w="64"
        borderRight="1px"
        borderColor="gray.200"
        bg="white"
        p={6}
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        overflowY="auto"
      >
        <VStack align="stretch" gap={6} h="full">
          <Box>
            <RouterLink to="/styleguide" style={{ textDecoration: "none" }}>
              <Heading size="md" color="gray.900">
                Design System
              </Heading>
            </RouterLink>
            <Text fontSize="sm" color="gray.500" mt={1}>
              BFIN Tokens
            </Text>
          </Box>

          <VStack as="nav" align="stretch" gap={6} flex={1}>
            {navigation.map((section) => (
              <Box key={section.title}>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.500"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {section.title}
                </Text>
                <VStack as="ul" align="stretch" gap={1} listStyleType="none">
                  {section.items.map((item) => (
                    <Box as="li" key={item.href}>
                      <RouterLink
                        to={item.href}
                        style={{
                          display: "block",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          transition: "all 0.2s",
                          backgroundColor: pathname === item.href ? "var(--purple-600)" : "transparent",
                          color: pathname === item.href ? "white" : "var(--gray-700)",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = pathname === item.href ? "var(--purple-700)" : "var(--gray-100)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = pathname === item.href ? "var(--purple-600)" : "transparent";
                        }}
                      >
                        {item.name}
                      </RouterLink>
                    </Box>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>

          {/* Back to App Link */}
          <Box pt={6} borderTop="1px" borderColor="gray.200" mt="auto">
            <RouterLink
              to="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: "var(--gray-500)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--gray-900)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gray-500)";
              }}
            >
              <Icon as={ArrowLeft} boxSize={4} />
              Voltar ao App
            </RouterLink>
          </Box>
        </VStack>
      </Box>

      {/* Main content - offset by sidebar width */}
      <Box as="main" flex={1} ml="64" overflowY="auto" bg="gray.50">
        <Outlet />
      </Box>
    </Flex>
  )
}
