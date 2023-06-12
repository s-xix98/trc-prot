import { ReactNode } from 'react';
import Modal from '@mui/material/Modal';

import { Container } from '@/components/Layout/Container';

export const ModalView = ({
  children,
  modalIsOpen,
  closeModal,
}: {
  children: ReactNode;
  modalIsOpen: boolean;
  closeModal: () => void;
}) => {
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '90%',
    width: '90%',
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#252525',
    outline: 'none',
  };

  return (
    <Modal open={modalIsOpen} onClose={closeModal}>
      <Container style={style}>{children}</Container>
    </Modal>
  );
};
