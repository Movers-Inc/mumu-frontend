"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "@/components/atoms";

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [toastInfo, setToastInfo] = useState({ open: false, message: "" });

  const showToast = useCallback((message: string) => {
    setToastInfo({ open: true, message });

    // 1초 후 자동 닫힘
    setTimeout(() => {
      setToastInfo((info) => ({ ...info, open: false }));
    }, 1000); // 1000ms = 1초
  }, []);

  const onClose = useCallback(() => {
    setToastInfo((info) => ({ ...info, open: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast body={toastInfo.message} open={toastInfo.open} onClose={onClose} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
