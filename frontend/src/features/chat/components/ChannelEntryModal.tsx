import { useModal } from "@/hooks/useModal";
import { chatChannelDto } from "../types/chatChannelDto";
import { ModalView } from "@/components/Elements/Modal/ModalView";
import { Container } from "@mui/material";
import { useJoinChannel } from "../api/joinChannel";

export const ChannelEntryModal = ({
  channelData,
  key,
}:{
  channelData:chatChannelDto
  key:number
}) => {
  const {modalIsOpen, openModal, closeModal} = useModal();
  const {emit} = useJoinChannel();

  const entryRoom = () => {
    emit(channelData.id);
    closeModal();
  };
  return (
    <Container>
      <ModalView
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      >
        <h1>{channelData.roomName}</h1>
        <button onClick={entryRoom}>入る</button>
        <button onClick={closeModal}>入らない</button>
      </ModalView>
      <p key={key} onClick={openModal}>{channelData.roomName}</p>
    </Container>
  );
};