import React, { createContext, useContext, useState } from 'react';
import { GARMENTS } from '../data/garments';
import { tailors } from '../data/tailors';

const AtelierContext = createContext();

export const AtelierProvider = ({ children }) => {
  const [activeGarment, setActiveGarment] = useState(GARMENTS[0]);
  const [activeTab, setActiveTab] = useState('atelier'); // 'salon' | 'atelier' | 'textiles' | 'editions' | 'studio'
  const currency = 'NGN'; // Fixed to Naira (₦) only
  
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
    style: 'senator', // 'senator' | 'agbada' | 'kaftan' | 'dashiki'
    fit: 'tailored',   // 'slim' | 'tailored' | 'flowing'
    colorHex: '#800020',
    colorName: 'Imperial Cherry Burgundy',
    fabric: 'Aso-Oke Silk & Cotton Blend',
    collar: 'mandarin', // 'mandarin' | 'v-neck' | 'embroidery-collar'
    pockets: 'single', // 'none' | 'single' | 'dual-flap' | 'zip'
    embroidery: 'geometric', // 'none' | 'geometric' | 'filigree' | 'minimal'
    sleeve: 'long',   // 'short' | 'quarter' | 'long'
    priceNGN: 520000
  });

  // Customer Order Details
  const [orderDetails, setOrderDetails] = useState({
    fullName: 'Abraham Sterling',
    email: 'patron@loom.fashion',
    phone: '+234 803 123 4567',
    address: '12 Marina Boulevard, Victoria Island, Lagos'
  });

  // Collaborative Fitting Room Sync
  const [roomCode, setRoomCode] = useState('ROOM-849201');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Master Tailor', time: '18:40', text: 'Good evening! Your 3D chest measurement (40 in) has been confirmed. Fabric cutting is scheduled.', isTailor: true },
    { sender: 'You', time: '18:42', text: 'Thank you! Excited to proceed with Payaza checkout in Naira.', isTailor: false }
  ]);

  // Currency Formatting (Naira ₦ only)
  const formatPrice = (priceNGN) => {
    const ngnVal = priceNGN || 697500;
    return `₦${ngnVal.toLocaleString()}`;
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
        currency,
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
