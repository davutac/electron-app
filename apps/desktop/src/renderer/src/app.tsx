import StartupGate from "@/components/startup-gate";
import { ThemeProvider } from "@/components/theme-provider";

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <StartupGate />
  </ThemeProvider>
);

export default App;
