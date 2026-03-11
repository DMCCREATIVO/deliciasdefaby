import React, { createContext, useContext, useState } from "react";

type Currency = "CLP" | "USD" | "EUR" | "BRL" | "ARS" | "MXN" | "COP" | "PEN";
type Language = "es" | "en" | "pt";

interface SystemContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  formatPrice: (price: number) => string;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used within a SystemProvider");
  }
  return context;
};

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("CLP");
  const [language, setLanguage] = useState<Language>("es");

  const formatPrice = (price: number) => {
    const localeMap = {
      es: "es-CL",
      en: "en-US",
      pt: "pt-BR"
    };

    const formatter = new Intl.NumberFormat(localeMap[language], {
      style: "currency",
      currency: currency,
    });
    return formatter.format(price);
  };

  return (
    <SystemContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        formatPrice,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};