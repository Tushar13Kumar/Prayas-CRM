import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // localStorage se theme yaad rakhega
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("prayas-theme");
    return saved ? saved === "dark" : true; // default: dark
  });

  useEffect(() => {
    localStorage.setItem("prayas-theme", isDark ? "dark" : "light");
    // root pe class lagao — CSS variables switch honge
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);