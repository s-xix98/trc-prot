import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormControlLabel, FormGroup } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import { useSocket } from '@/hooks/useSocket';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { FormInput } from '@/components/Elements/Input/FormInput';

import { useCreateChannel } from '../api/createChannel';
import {
  CreateChannelDto,
  CreateChannelSchema,
} from '../types/CreateChannelDto';

export const ChatChannelCreateModal = () => {
  const { modalIsOpen, openModal, closeModal } = useModal();
  const createChannel = useCreateChannel();
  const methods = useForm<CreateChannelDto>({
    resolver: zodResolver(CreateChannelSchema),
    // 何かしら値をセットする必要があるので設定
    defaultValues: { userId: '' },
  });

  const handleChannelCreate: SubmitHandler<CreateChannelDto> = (data) => {
    console.log(data);
    createChannel.emit(data.roomName);
    closeModal();
    methods.reset();
  };

  // TODO roomの情報が返ってきてらチャットリストの更新をする必要があるから
  // chatの一番上の階層で一番上の階層で宣言するのがいいかも
  // eslint-disable-next-line
  useSocket('createChannel', (createdRoom: any) => {
    console.log(createdRoom);
  });

  return (
    <>
      <p onClick={() => openModal()}>ChannelCreate</p>
      <ModalView
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        width="200px"
        height="250px"
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleChannelCreate)}>
            <h3>ChannelCreate</h3>
            <hr />
            <FormInput name="roomName" type="text" placeholder="roomName" />
            <br />
            <FormInput name="password" type="text" placeholder="password" />
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="isPrivate" />
            </FormGroup>
            <Button type="submit">Create</Button>
            <Button
              type="reset"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </Button>
          </form>
        </FormProvider>
      </ModalView>
    </>
  );
};
