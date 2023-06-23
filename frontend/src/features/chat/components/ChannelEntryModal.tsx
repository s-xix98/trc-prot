import { useModal } from "@/hooks/useModal";
import { chatChannelDto } from "../types/chatChannelDto";
import { ModalView } from "@/components/Elements/Modal/ModalView";
import { Container } from "@mui/material";

export const ChannelEntryModal = ({
  channelData,
  key,
}:{
  channelData:chatChannelDto
  key:number
}) => {
  const {modalIsOpen, openModal, closeModal} = useModal();

  return (
    <Container>
      <ModalView
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      >
        <h1>{channelData.roomName}</h1>
        <button>入る</button>
        <button>入らない</button>
      </ModalView>
      <p key={key} onClick={openModal}>{channelData.roomName}</p>
    </Container>
  );
};