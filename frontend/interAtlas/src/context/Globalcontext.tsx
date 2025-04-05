// src/contexts/GlobalContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface GlobalState {
  user: { name: string; email: string; _id:string } | null;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setUser: (user: { name: string; email: string; _id:string  } | null) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string; _id:string  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <GlobalContext.Provider value={{ user, sidebarOpen, toggleSidebar, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
