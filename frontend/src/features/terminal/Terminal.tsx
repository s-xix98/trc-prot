import { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { KeyboardEvent } from 'react';

import { Container } from '@/components/Layout/Container';
import { useScroll } from '@/hooks/useScroll';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { userInfoAtom } from '@/stores/jotai';
import { tokenStorage } from '@/utils/tokenStorage';
import { Input } from '@/components/Elements/Input/Input';

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

  const router = useRouter();

  const onKeyDownAct = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    e.preventDefault(); // 改行を入力しない

    if (input === 'logout') {
      setUserInfo(undefined);
      tokenStorage.remove();
      router.push('/login');
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
          start={`${userInfo?.username ?? ''} > `}
          onChangeAct={(e) => {
            setInput(e.target.value);
          }}
          onKeyDownAct={onKeyDownAct}
          disableUnderline={true}
        />
      </div>
    </Container>
  );
};
