import React, { useEffect, useState } from "react";
import styles from "./Toast.module.css";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
                                              message,
                                              type,
                                              duration = 3000,
                                              onClose
                                            }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.message}>{message}</div>
    </div>
  );
};
