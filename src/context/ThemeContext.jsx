import React, { createContext, useContext, useState } from 'react';
import logo from '../assets/logo-bayelsa.png';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        logo: logo,
        lga: 'Yenagoa Local Government',
        receiptTitle: 'Payment Receipt',
        primaryColor: '#3B78BD',
        secondaryColor: '#2a5a8f',
        watermarkText: 'PAID',
    });

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
