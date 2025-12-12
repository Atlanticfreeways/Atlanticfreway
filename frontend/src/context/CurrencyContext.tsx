import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

interface CurrencyContextType {
    currency: Currency;
    rate: number;
    setCurrency: (c: Currency) => void;
    formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const RATES: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 147.50
};

const SYMBOLS: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
};

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [rate, setRate] = useState(1);

    useEffect(() => {
        setRate(RATES[currency]);
    }, [currency]);

    const formatPrice = (priceInUSD: number) => {
        const converted = priceInUSD * rate;
        return `${SYMBOLS[currency]}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, rate, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
    return context;
};
