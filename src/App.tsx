import { BrowserRouter } from "react-router-dom";
import "./global.css";
import { Suspense } from "react";
import AppRouter from "./routes/router";
import { AlertProvider } from "./context/AlertContext";
import { QueryClientProvider } from "./context/QueryClientProvider";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "10px",
        },
        head: {
          fontWeight: "bold",
          background: "#c9e6ff",
        },
      },
    },
  },
});
const App: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <QueryClientProvider>
            <AlertProvider>
              <AppRouter />
            </AlertProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
