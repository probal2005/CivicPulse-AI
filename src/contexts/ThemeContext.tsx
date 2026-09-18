import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   THEME TYPES
========================================================= */

export type ThemeName =
  | "civic"
  | "midnight"
  | "crimson"
  | "neon"
  | "cyber"
  | "aurora"
  | "contrast";

export interface ThemeOption {
  id: ThemeName;
  name: string;
  description: string;
  icon: string;
  preview: string;
}

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: ThemeOption[];
  currentTheme: ThemeOption;
}

/* =========================================================
   THEMES
========================================================= */

export const themes: ThemeOption[] = [
  {
    id: "civic",
    name: "Civic Light",
    description: "Clean civic interface",
    icon: "☀️",
    preview:
      "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep blue dark mode",
    icon: "🌙",
    preview:
      "linear-gradient(135deg, #020617 0%, #1e3a8a 100%)",
  },
  {
    id: "crimson",
    name: "Crimson Alert",
    description: "Black and red command style",
    icon: "🔴",
    preview:
      "linear-gradient(135deg, #050505 0%, #991b1b 100%)",
  },
  {
    id: "neon",
    name: "Neon Pulse",
    description: "Purple futuristic interface",
    icon: "🟣",
    preview:
      "linear-gradient(135deg, #090014 0%, #7c3aed 55%, #ec4899 100%)",
  },
  {
    id: "cyber",
    name: "Cyber Civic",
    description: "Green technology interface",
    icon: "🟢",
    preview:
      "linear-gradient(135deg, #020807 0%, #047857 100%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Cyan purple atmosphere",
    icon: "🌌",
    preview:
      "linear-gradient(135deg, #07111f 0%, #0891b2 50%, #7e22ce 100%)",
  },
  {
    id: "contrast",
    name: "High Contrast",
    description: "Maximum readability",
    icon: "⚡",
    preview:
      "linear-gradient(135deg, #000000 0%, #ffffff 100%)",
  },
];

/* =========================================================
   CONTEXT
========================================================= */

const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined,
  );

const STORAGE_KEY = "civicpulse-ai-theme";

/* =========================================================
   VALID THEME CHECK
========================================================= */

function isValidTheme(
  value: string | null,
): value is ThemeName {
  return themes.some(
    (theme) => theme.id === value,
  );
}

/* =========================================================
   PROVIDER
========================================================= */

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<ThemeName>(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEY,
          );

        if (isValidTheme(saved)) {
          return saved;
        }
      } catch {
        // Ignore localStorage errors.
      }

      return "civic";
    });

  /* =======================================================
     APPLY THEME
  ======================================================= */

  useEffect(() => {
    const root =
      document.documentElement;

    /*
      Remove every CivicPulse theme
      before applying the new one.
    */

    themes.forEach((item) => {
      root.classList.remove(
        `theme-${item.id}`,
      );
    });

    root.classList.add(
      `theme-${theme}`,
    );

    root.dataset.civicTheme = theme;

    /*
      Keep a simple attribute as well.
      Useful for CSS and debugging.
    */

    root.setAttribute(
      "data-theme",
      theme,
    );

    /*
      Browser native controls.
    */

    root.style.colorScheme =
      theme === "civic"
        ? "light"
        : "dark";

    /*
      Persist.
    */

    try {
      localStorage.setItem(
        STORAGE_KEY,
        theme,
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [theme]);

  /* =======================================================
     CHANGE THEME
  ======================================================= */

  const setTheme = (
    nextTheme: ThemeName,
  ) => {
    setThemeState(nextTheme);
  };

  /* =======================================================
     CURRENT THEME
  ======================================================= */

  const currentTheme =
    useMemo(
      () =>
        themes.find(
          (item) =>
            item.id === theme,
        ) ?? themes[0],
      [theme],
    );

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo<ThemeContextValue>(
      () => ({
        theme,
        setTheme,
        themes,
        currentTheme,
      }),
      [
        theme,
        currentTheme,
      ],
    );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider.",
    );
  }

  return context;
}