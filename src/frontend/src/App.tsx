import "./App.css";
import { AuthProvider } from "./context/AuthProvider";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />

          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
