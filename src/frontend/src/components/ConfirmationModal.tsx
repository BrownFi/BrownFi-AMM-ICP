import { PropsWithChildren, useState } from "react";
import Modal from "./Modal";

interface ConfirmationModalProps extends PropsWithChildren {
}

export function ConfirmationModal({ children }: ConfirmationModalProps) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Modal
        openModal={modal}
        closeModal={() => setModal(false)}
      >
        Are you sure?
      </Modal>
      {children}
    </>
  )
}

export default ConfirmationModal;