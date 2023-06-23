import { chatChannelDto } from "../types/chatChannelDto";

export const ChannelEntryModal = ({
  channelData,
  key,
}:{
  channelData:chatChannelDto
  key:number
}) => {

  return <p key={key}>{channelData.roomName}</p>;
};