import { IconButton } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import { z } from 'zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';

import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useModal } from '@/hooks/useModal';
import { Container } from '@/components/Layout/Container';
import { FormInput } from '@/components/Elements/Input/FormInput';

import { chatChannelDto } from '../types/chatChannelDto';
import { useUpdateChatRoom } from '../api/updateChatRoom';

import { ChannelInfo } from './ChannelInfo';

const ShowPrivateState = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const { setIsPrivate } = useUpdateChatRoom();

  return (
    <>
      {selectedChannel.isPrivate === true && (
        <IconButton
          color="primary"
          size="small"
          onClick={() => setIsPrivate(selectedChannel.id, false)}
        >
          <PublicOffIcon />
        </IconButton>
      )}
      {selectedChannel.isPrivate === false && (
        <IconButton
          color="primary"
          size="small"
          onClick={() => setIsPrivate(selectedChannel.id, true)}
        >
          <PublicIcon />
        </IconButton>
      )}
    </>
  );
};

const ShowPasswordState = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const modal = useModal();
  const { updatePassword, unsetPassword } = useUpdateChatRoom();

  const ChatPasswordDtoSchema = z.object({ password: z.string().min(1) });
  type ChatPasswordDto = z.infer<typeof ChatPasswordDtoSchema>;
  const methods = useForm<ChatPasswordDto>({
    resolver: zodResolver(ChatPasswordDtoSchema),
    defaultValues: { password: '' },
  });

  const handleUpdatePassword: SubmitHandler<ChatPasswordDto> = (data) => {
    updatePassword(selectedChannel.id, data.password);
    resetForm();
    modal.closeModal();
  };

  const resetForm = () => {
    methods.reset({ password: '' });
  };

  const unsetPasswordAct = () => {
    unsetPassword(selectedChannel.id);
    modal.closeModal();
  };

  return (
    <>
      <ModalView {...modal} height="250px" width="200">
        <p>Set Password</p>
        <br />
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleUpdatePassword)}>
            <FormInput name="password" placeholder="new password" type="text" />
            <br />
            <button type="submit">Set New Password</button>
          </form>
        </FormProvider>
        <br />
        {selectedChannel.hasPassword === true && (
          <button onClick={unsetPasswordAct}>Unset Password</button>
        )}
      </ModalView>
      {selectedChannel.hasPassword === true && (
        <IconButton
          color="primary"
          size="small"
          onClick={() => modal.openModal()}
        >
          <LockIcon />
        </IconButton>
      )}
      {selectedChannel.hasPassword === false && (
        <IconButton
          color="primary"
          size="small"
          onClick={() => modal.openModal()}
        >
          <LockOpenIcon />
        </IconButton>
      )}
    </>
  );
};

const ShowRoomNameEditIcon = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const modal = useModal();
  const ChatRoomNameDtoSchema = z.object({ roomName: z.string().min(1) });
  type ChatRoomNameDto = z.infer<typeof ChatRoomNameDtoSchema>;
  const methods = useForm<ChatRoomNameDto>({
    resolver: zodResolver(ChatRoomNameDtoSchema),
    defaultValues: { roomName: '' },
  });
  const { updateChatRoomName } = useUpdateChatRoom();

  const handleUpdateRoomName: SubmitHandler<ChatRoomNameDto> = (data) => {
    updateChatRoomName(selectedChannel.id, data.roomName);
    resetForm();
    modal.closeModal();
  };

  const resetForm = () => {
    methods.reset({ roomName: '' });
  };

  return (
    <>
      <ModalView {...modal} height="250px" width="200">
        <p>Update Room Name</p>
        <br />
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleUpdateRoomName)}>
            <FormInput
              name="roomName"
              placeholder="new room name"
              type="text"
            />
            <br />
            <button type="submit">Set New Room Name</button>
          </form>
        </FormProvider>
      </ModalView>
      <IconButton
        color="primary"
        size="small"
        onClick={() => modal.openModal()}
      >
        <EditIcon />
      </IconButton>
    </>
  );
};

export const ChatTalkAreaHeader = ({
  selectedChannel,
  setSelectedChannel,
}: {
  selectedChannel: chatChannelDto;
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
}) => {
  const modal = useModal();
  return (
    <>
      <ModalView {...modal} height="250px" width="200px">
        <ChannelInfo
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />
      </ModalView>
      <div>
        <Container>
          <h2
            onClick={() => {
              modal.openModal();
            }}
            style={{ margin: 'auto auto auto 3px' }}
          >
            ChatTalkArea {selectedChannel.roomName}
          </h2>
          <div style={{ margin: 'auto 10px auto auto' }}>
            <ShowPrivateState selectedChannel={selectedChannel} />
            <ShowPasswordState selectedChannel={selectedChannel} />
            <ShowRoomNameEditIcon selectedChannel={selectedChannel} />
          </div>
        </Container>
      </div>
      <hr />
    </>
  );
};
