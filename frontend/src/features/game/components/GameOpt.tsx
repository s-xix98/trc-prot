import { Slider } from '@mui/material';
import { useState } from 'react';

import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useModal } from '@/hooks/useModal';

import { GameOptionDto } from '../types/gameOptionDto';

export const GameOptSetterModal = ({
  btnText,
  onClickAct,
}: {
  btnText: string;
  onClickAct: (gameOpt: GameOptionDto) => void;
}) => {
  const modal = useModal();
  const [gameOpt, setGameOpt] = useState<GameOptionDto>({
    ballSpeed: 1,
    matchpoint: 11,
  });

  return (
    <>
      <ModalView {...modal} height="250px" width="200px">
        <GameOptSetter
          gameOpt={gameOpt}
          setGameOpt={setGameOpt}
          btnText={btnText}
          onClickAct={onClickAct}
        />
      </ModalView>
      <button
        onClick={() => {
          modal.openModal();
        }}
      >
        {btnText}
      </button>
    </>
  );
};

export const GameOptSetter = ({
  gameOpt,
  setGameOpt,
  btnText,
  onClickAct,
}: {
  gameOpt: GameOptionDto;
  setGameOpt: React.Dispatch<React.SetStateAction<GameOptionDto>>;
  btnText: string;
  onClickAct: (gameOpt: GameOptionDto) => void;
}) => {
  const handleChangeBallSpeed = (event: Event, newValue: number | number[]) => {
    setGameOpt((prev) => ({ ...prev, ballSpeed: newValue as number }));
  };

  const handleChangeMatchpoint = (
    event: Event,
    newValue: number | number[],
  ) => {
    setGameOpt((prev) => ({ ...prev, matchpoint: newValue as number }));
  };

  return (
    <>
      <p>Set Game Opt</p>
      <br />
      <p>Ball Speed : {gameOpt.ballSpeed}</p>
      <Slider
        value={gameOpt.ballSpeed}
        onChange={handleChangeBallSpeed}
        valueLabelDisplay="auto"
        step={1}
        min={1}
        max={10}
      />
      <br />
      <p>Match Point : {gameOpt.matchpoint}</p>
      <Slider
        value={gameOpt.matchpoint}
        onChange={handleChangeMatchpoint}
        valueLabelDisplay="auto"
        step={1}
        min={1}
        max={11}
      />
      <br />
      <button onClick={() => onClickAct(gameOpt)}>{btnText}</button>
    </>
  );
};
