import { useEffect, useRef } from "react";

export interface ModalProps {
  openModal: boolean;
  children?: React.ReactNode;
};

function Modal({ openModal, children }: ModalProps) {
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
    >
      {children}
      <button onClick={() => { ref.current?.close() }}>
        Close
      </button>
    </dialog>
  );
}

export default Modal;