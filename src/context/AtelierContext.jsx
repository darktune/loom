import React, { createContext, useContext, useState, useEffect } from 'react';
import { GARMENTS } from '../data/garments';
import { tailors } from '../data/tailors';

const AtelierContext = createContext();

export const AtelierProvider = ({ children }) => {
  const [activeGarment, setActiveGarment] = useState(GARMENTS[0]);
  const [activeTab, setActiveTab] = useState('salon'); // 'salon' | 'atelier' | 'studio' | 'textiles' | 'editions'
  
  // Luxury Theme Engine: 'noir' (Obsidian) | 'burgundy' (Imperial Wine) | 'ivory' (Silk Gallery)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('loom_theme') || 'noir';
  });

  // Dynamic Multi-Currency System (USD and NGN)
  const [currency, setCurrency] = useState('NGN'); // 'NGN' | 'USD'
  const exchangeRate = 1600; // 1 USD = ₦1,600 NGN

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('loom_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'noir' ? 'burgundy' : theme === 'burgundy' ? 'ivory' : 'noir';
    setTheme(nextTheme);
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'NGN' ? 'USD' : 'NGN'));
  };

  // Modals & Drawers
  const [isSizingWizardOpen, setIsSizingWizardOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCollaborativeRoomOpen, setIsCollaborativeRoomOpen] = useState(false);
  const [isConceptGeneratorOpen, setIsConceptGeneratorOpen] = useState(false);
  const [isTextileArchiveOpen, setIsTextileArchiveOpen] = useState(false);

  // Tailor Selection
  const [selectedTailor, setSelectedTailor] = useState(tailors[0]);

  // Customer Anatomical 3D Measurements
  const [measurements, setMeasurements] = useState({
    height: 182,  // cm
    weight: 78,   // kg
    chest: 40,    // in
    waist: 32,    // in
    hips: 39,     // in
    shoulder: 19, // in
    inseam: 32,   // in
    unit: 'in'    // 'in' or 'cm'
  });

  // Custom Native Design Builder State
  const [customNative, setCustomNative] = useState({
    style: 'agbada', // 'senator' | 'agbada' | 'kaftan' | 'dashiki'
    fit: 'tailored',   // 'slim' | 'tailored' | 'flowing'
    colorHex: '#800020',
    colorName: 'Imperial Cherry Burgundy',
    fabric: 'Aso-Oke Silk & Cotton Blend',
    collar: 'mandarin', // 'mandarin' | 'v-neck' | 'embroidery-collar'
    pockets: 'single', // 'none' | 'single' | 'dual-flap' | 'zip'
    embroidery: 'geometric', // 'none' | 'geometric' | 'filigree' | 'minimal'
    sleeve: 'long',   // 'short' | 'quarter' | 'long'
    priceNGN: 697500
  });

  // Customer Order Details
  const [orderDetails, setOrderDetails] = useState({
    fullName: 'Sterling Abraham',
    email: 'client@loom.atelier',
    phone: '+234 803 555 0192',
    address: '14 Queen’s Drive, Ikoyi, Lagos'
  });

  // Collaborative Fitting Room Sync
  const [roomCode, setRoomCode] = useState('LOOM-VIRTUAL-849');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Master Artisan', time: '10:15', text: 'Welcome to the Loom digital fitting room. Your 3D measurements are synced.', isTailor: true }
  ]);

  // Adaptive Price Formatting
  const formatPrice = (priceNGN) => {
    const ngn = priceNGN || 697500;
    if (currency === 'USD') {
      const usd = Math.round(ngn / exchangeRate);
      return `$${usd.toLocaleString()}`;
    }
    return `₦${ngn.toLocaleString()}`;
  };

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    const newMessage = {
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
      isTailor: false
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  return (
    <AtelierContext.Provider
      value={{
        activeGarment,
        setActiveGarment,
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        toggleTheme,
        currency,
        toggleCurrency,
        formatPrice,
        isSizingWizardOpen,
        setIsSizingWizardOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCollaborativeRoomOpen,
        setIsCollaborativeRoomOpen,
        isConceptGeneratorOpen,
        setIsConceptGeneratorOpen,
        isTextileArchiveOpen,
        setIsTextileArchiveOpen,
        selectedTailor,
        setSelectedTailor,
        measurements,
        setMeasurements,
        customNative,
        setCustomNative,
        orderDetails,
        setOrderDetails,
        roomCode,
        chatMessages,
        sendChatMessage,
        GARMENTS,
        tailors
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
};

export const useAtelier = () => {
  const context = useContext(AtelierContext);
  if (!context) {
    throw new Error('useAtelier must be used within an AtelierProvider');
  }
  return context;
};
