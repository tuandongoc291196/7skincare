import { BrowserRouter } from "react-router-dom";
import "./global.css";
import { Suspense } from "react";
import AppRouter from "./routes/router";
import { AlertProvider } from "./context/AlertContext";
import { QueryClientProvider } from "./context/QueryClientProvider";

const App: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <QueryClientProvider>
          <AlertProvider>
            <AppRouter />
          </AlertProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
