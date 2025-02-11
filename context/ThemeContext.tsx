import React, { createContext, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Appearance } from "react-native";
import { ReactNode } from "react";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;


  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
