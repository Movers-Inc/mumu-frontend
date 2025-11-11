"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { Common } from "@/components/popups";

interface PopupOptions {
  title: string;
  body: string;
  placeholder?: string;
  prevPlaceholder?: string;
  red?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

interface PopupContextType {
  openPopup: (options: PopupOptions) => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PopupOptions>({
    title: "",
    body: ""
  });

  const openPopup = useCallback((newOptions: PopupOptions) => {
    // `onNext`를 래핑하여 처리
    const wrappedOptions = {
      ...newOptions,
      onNext: () => {
        newOptions.onNext?.(); // 기존 onNext 호출
        setIsOpen(false); // 무조건 팝업 닫기
      }
    };
    setOptions(wrappedOptions);
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  const PopupComponent = useCallback(() => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
      <Common
        open={isOpen}
        title={options.title}
        body={options.body}
        placeholder={options.placeholder}
        prevplacehloder={options.prevPlaceholder}
        red={options.red}
        onNext={options.onNext}
        onPrevious={options.onPrevious}
        onClose={closePopup}
      />,
      document.body
    );
  }, [isOpen, options, closePopup]);

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {PopupComponent()}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
