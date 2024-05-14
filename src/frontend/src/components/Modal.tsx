import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  openModal: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

function Modal({ openModal, closeModal, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog
      ref={ref}
      onCancel={closeModal}
    >
      {children}
      <button onClick={closeModal}>
        Close
      </button>
    </dialog>
  );
}

export default Modal;