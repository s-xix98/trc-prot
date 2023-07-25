import { useState } from 'react';
import { ChangeEvent } from 'react';
import { KeyboardEvent } from 'react';

import { Container } from '@/components/Layout/Container';
import { useScroll } from '@/hooks/useScroll';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { Input } from '@/components/Elements/Input/Input';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { useLogout } from '../user/api/userLogin';

import { TerminalOutput } from './TerminalOutput';

export const Terminal = ({
  commandElemMap,
}: {
  commandElemMap: Map<string, JSX.Element>;
}) => {
  const [input, setInput] = useState('');
  const [outputArr, setOutputArr] = useState<JSX.Element[]>([]);
  const { scrollBottomRef, handleScroll } = useScroll(outputArr);
  const { currentUserInfo } = useCurrentUser();

  const { logout } = useLogout();

  const [currentModalElem, setCurrentModalElem] = useState<JSX.Element>();

  const { modalIsOpen, openModal, closeModal } = useModal();

  const onChangeAct = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onKeyDownAct = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    e.preventDefault(); // 改行を入力しない

    if (input === '') {
      return;
    }

    if (input === 'logout') {
      logout();
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
      <div style={{ padding: '3px' }}>
        <Input
          msg={input}
          start={`${currentUserInfo?.username ?? ''} > `}
          onChangeAct={onChangeAct}
          onKeyDownAct={onKeyDownAct}
          disableUnderline={true}
        />
      </div>
    </Container>
  );
};
