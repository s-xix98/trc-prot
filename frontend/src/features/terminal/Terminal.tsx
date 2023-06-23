import { useState } from 'react';
import { ChangeEvent } from 'react';
import { useAtom } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { useScroll } from '@/hooks/useScroll';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { userInfoAtom } from '@/stores/jotai';
import { tokenStorage } from '@/utils/tokenStorage';

import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';

export const Terminal = ({
  commandElemMap,
}: {
  commandElemMap: Map<string, JSX.Element>;
}) => {
  const [input, setInput] = useState('');
  const [outputArr, setOutputArr] = useState<JSX.Element[]>([]);
  const { scrollBottomRef, handleScroll } = useScroll(outputArr);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  const [currentModalElem, setCurrentModalElem] = useState<JSX.Element>();

  const { modalIsOpen, openModal, closeModal } = useModal();

  const onChangeAct = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === '\n') {
      return;
    }
    if (e.target.value.slice(-1) !== '\n') {
      setInput(e.target.value);
      return;
    }
    if (input === 'logout') {
      setUserInfo(undefined);
      tokenStorage.remove();
      return;
    }

    const inputElem = <p>&gt;&nbsp;{input}</p>;

    const commandElem = commandElemMap.get(input);

    handleScroll();

    if (commandElem) {
      setOutputArr([...outputArr, inputElem]);
      setCurrentModalElem(commandElem);
      openModal();
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
      <ModalView modalIsOpen={modalIsOpen} closeModal={closeModal}>
        {currentModalElem}
      </ModalView>
      <TerminalInput
        input={input}
        username={userInfo?.username ?? ''}
        onChangeAct={onChangeAct}
      />
    </Container>
  );
};
