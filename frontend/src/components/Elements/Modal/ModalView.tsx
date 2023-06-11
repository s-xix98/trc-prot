import { ReactNode } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('body');
export const ModalView = ({
  children,
  modalIsOpen,
  closeModal,
}: {
  children: ReactNode;
  modalIsOpen: boolean;
  closeModal: () => void;
}) => {
  const customStyles = {
    content: {
      background: 'dimgray',
    },
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      {children}
    </Modal>
  );
};
