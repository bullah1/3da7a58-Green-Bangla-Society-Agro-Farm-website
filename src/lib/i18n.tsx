import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "bn" | "en";

const STORAGE_KEY = "gb-lang";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "bn",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  // Bangla is the site default; English on click.
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "bn" || saved === "en") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  const toggle = useCallback(() => setLang(lang === "bn" ? "en" : "bn"), [lang, setLang]);
  return { lang, setLang, toggle };
}

/** Pick a string by language: tx(lang, "English text", "বাংলা টেক্সট") */
export function tx(lang: Lang, en: string, bn: string): string {
  return lang === "bn" ? bn : en;
}
