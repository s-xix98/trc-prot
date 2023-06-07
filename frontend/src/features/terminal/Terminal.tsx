import { ReactNode, useState } from 'react';
import { ChangeEvent } from 'react';
import Modal from 'react-modal';

import { Container } from '@/components/Layout/Container';
import { useScroll } from '@/hooks/useScroll';

import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';

Modal.setAppElement('body');
export const TerminalModal = ({
  children,
  modalIsOpen,
  closeModal,
}: {
  children: ReactNode | undefined;
  modalIsOpen: boolean;
  closeModal: () => void;
}) => {
  if (children === undefined) {
    return <></>;
  }

  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
      {children}
    </Modal>
  );
};

export const Terminal = ({
  commandElemMap,
}: {
  commandElemMap: Map<string, JSX.Element>;
}) => {
  const [input, setInput] = useState('');
  const [outputArr, setOutputArr] = useState<JSX.Element[]>([]);
  const { scrollBottomRef, handleScroll } = useScroll(outputArr);

  const [currentModalElem, setCurrentModalElem] = useState<JSX.Element>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onChangeAct = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === '\n') {
      return;
    }
    if (e.target.value.slice(-1) !== '\n') {
      setInput(e.target.value);
      return;
    }

    const inputElem = <p>&gt;&nbsp;{input}</p>;

    const commandElem = commandElemMap.get(input);

    handleScroll();

    if (commandElem) {
      setOutputArr([...outputArr, inputElem]);
      setCurrentModalElem(commandElem);
      setModalIsOpen(true);
    } else {
      const notFoundElem = <p>NotFound</p>;
      setOutputArr([...outputArr, inputElem, notFoundElem]);
    }

    setInput('');
  };

  return (
    <Container flexDirection="column">
      <h1>Terminal</h1>
      <TerminalOutput outputArr={outputArr} scrollBottomRef={scrollBottomRef} />
      <TerminalModal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        {currentModalElem}
      </TerminalModal>
      <TerminalInput input={input} onChangeAct={onChangeAct} />
    </Container>
  );
};
