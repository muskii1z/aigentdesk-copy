
import { useState, useCallback } from 'react';

export const useSignUpModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('/ask');

  const openModal = useCallback((url?: string) => {
    if (url) {
      setRedirectUrl(url);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    redirectUrl,
    openModal,
    closeModal,
    setIsOpen,
  };
};
