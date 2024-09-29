import { createContext, useState, useContext, useEffect } from "react";

// Create a Context for the theme
const ThemeContext = createContext();

// Create a custom hook for easier usage of the ThemeContext
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider Component to wrap the app
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark-theme"); // default to 'light' theme

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme === "light" ? "dark-theme" : "light"
        );
    };
    useEffect(() => {
        console.log(document);
        document.body.className = theme; // Set the body's class based on theme
    }, [theme]);
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
