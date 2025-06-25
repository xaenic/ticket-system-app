import "./App.css";
import { AuthProvider } from "./context/AuthProvider";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />

        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;
