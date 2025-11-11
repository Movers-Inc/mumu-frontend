import React, { useState, useCallback } from "react";
import { Toast } from "@/components/atoms";

const useToast = () => {
  const [toastInfo, setToastInfo] = useState({ open: false, message: "" });

  const showToast = useCallback((message: string) => {
    setToastInfo({ open: true, message });
  }, []);

  const onClose = useCallback(() => {
    setToastInfo((info) => ({ ...info, open: false }));
  }, []);

  const ToastContainer = useCallback(
    () => (
      <Toast body={toastInfo.message} open={toastInfo.open} onClose={onClose} />
    ),
    [toastInfo, onClose]
  );

  return { showToast, ToastContainer };
};

export default useToast;
