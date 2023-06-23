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
        <p>test</p>
      </ModalView>
      <p key={key} onClick={openModal}>{channelData.roomName}</p>
    </Container>
  );
};