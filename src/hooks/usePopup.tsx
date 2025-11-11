import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { Common } from "@/components/popups"; // Common 컴포넌트 임포트

interface PopupOptions {
  title: string;
  body: string;
  placeholder?: string;
  prevPlaceholder?: string;
  red?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PopupOptions>({
    title: "",
    body: ""
  });

  const openPopup = useCallback((newOptions: PopupOptions) => {
    setOptions(newOptions);
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
      document.body // 팝업을 body에 렌더링
    );
  }, [isOpen, options, closePopup]);

  return {
    openPopup,
    closePopup,
    PopupComponent // 팝업 컴포넌트를 반환
  };
};

export default usePopup;
