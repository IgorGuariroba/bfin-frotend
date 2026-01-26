import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, VStack, Spinner, Text } from '@chakra-ui/react';
import { useAuth } from './contexts/AuthContext';

const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then((m) => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const DailyLimitPage = lazy(() =>
  import('./pages/DailyLimitPage').then((m) => ({ default: m.DailyLimitPage }))
);
const AddIncomePage = lazy(() => import('./pages/AddIncomePage').then((m) => ({ default: m.AddIncomePage })));
const AddFixedExpensePage = lazy(() =>
  import('./pages/AddFixedExpensePage').then((m) => ({ default: m.AddFixedExpensePage }))
);
const AddVariableExpensePage = lazy(() =>
  import('./pages/AddVariableExpensePage').then((m) => ({ default: m.AddVariableExpensePage }))
);
const CalendarPage = lazy(() => import('./pages/CalendarPage').then((m) => ({ default: m.CalendarPage })));

// Loading component using Chakra UI
function LoadingScreen() {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack gap={4}>
        <Spinner size="xl" colorPalette="brand" />
        <Text color="gray.600">Carregando...</Text>
      </VStack>
    </Box>
  );
}

// Componente para proteger rotas privadas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// Componente para redirecionar usuários autenticados
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Rota raiz redireciona para dashboard ou login */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Rotas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rotas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-limit"
          element={
            <PrivateRoute>
              <DailyLimitPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Dashboard initialExpandedForm="transacoes" />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-income"
          element={
            <PrivateRoute>
              <AddIncomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-fixed-expense"
          element={
            <PrivateRoute>
              <AddFixedExpensePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-variable-expense"
          element={
            <PrivateRoute>
              <AddVariableExpensePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          }
        />

        {/* 404 - Deve ser a última rota */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
