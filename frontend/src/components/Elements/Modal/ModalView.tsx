import { ReactNode } from 'react';
import Modal from '@mui/material/Modal';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

export const ModalView = ({
  children,
  modalIsOpen,
  closeModal,
  height = '90%',
  width = '90%',
}: {
  children: ReactNode;
  modalIsOpen: boolean;
  closeModal: () => void;
  height?: string;
  width?: string;
}) => {
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: height,
    width: width,
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#252525',
    outline: 'none',
  };

  return (
    <Modal open={modalIsOpen} onClose={closeModal}>
      <div style={style}>
        <Container flexDirection="column">
          <ContainerItem overflowY="scroll" overflowX="scroll">
            {children}
          </ContainerItem>
        </Container>
      </div>
    </Modal>
  );
};
