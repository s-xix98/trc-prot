export enum roomType {
  Chat = 'CHAT_',
  Game = 'GAME_',
}

export const generatePrefixedId = (prefix: roomType, id: string) => {
  return prefix + id;
};
