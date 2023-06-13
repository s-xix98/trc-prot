export enum socketNamespaceType {
  Chat = 'CHAT_',
  Game = 'GAME_',
}

export const generatePrefixedId = (prefix: socketNamespaceType, id: string) => {
  return prefix + id;
};
