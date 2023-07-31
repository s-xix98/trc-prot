import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';

import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { FormInput } from '@/components/Elements/Input/FormInput';
import { FormCheckbox } from '@/components/Elements/Checkbox/FormCheckbox';

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
  });

  const handleChannelCreate: SubmitHandler<CreateChannelDto> = (data) => {
    console.log(data);
    createChannel.emit(data.roomName, data.password, data.isPrivate);
    closeModal();
    methods.reset();
  };

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
            <FormCheckbox name="isPrivate" label="isPrivate" />
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
