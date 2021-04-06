import { Alert, AlertProps } from './Alert';
import React, { useEffect, useState } from 'react';

export const useAlert = () => {
  const [currentAlert, setCurrentAlert] = useState<AlertProps>();
  const [delayedOpen, setDelayedOpen] = useState(false);
  console.log(delayedOpen)

  useEffect(() => {
    if (currentAlert && !delayedOpen) {
      setTimeout(() => {
        setDelayedOpen(true);
        setCurrentAlert(alert => ({...alert, isOpen: true}));
      });
    }
  }, [currentAlert]);

  return [
    (alert: Omit<AlertProps, 'isOpen'>) => {
      return new Promise<boolean>(resolve => {
        setCurrentAlert({
          ...alert,
          isOpen: delayedOpen,
          onOkay: () => {
            alert.onOkay?.();
            resolve(true);
          },
          onCancel: () => {
            alert.onCancel?.();
            resolve(false);
          },
          onClose: () => {
            setCurrentAlert(a => ({ ...a, isOpen: false }));
          },
        });
      });
    },
    currentAlert ? <Alert {...currentAlert} /> : null,
  ] as const;
};
