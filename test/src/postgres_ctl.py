from collections import defaultdict
from dataclasses import dataclass
from pprint import pprint
from typing import Any

import pandas as pd
import psycopg2

from src.constants import (DB_TABLE_NAME_CHAT_INVITATION,
                           DB_TABLE_NAME_CHAT_ROOM, DB_TABLE_NAME_MESSAGE,
                           DB_TABLE_NAME_USER, POSTGRES_DATABASE,
                           POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT,
                           POSTGRES_USER)
from src.type_utils import enforce_type


@dataclass
class UserData:
    email: str
    user_id: str
    username: str

    def __post_init__(self) -> None:
        enforce_type(self.email, str)
        enforce_type(self.user_id, str)
        enforce_type(self.username, str)


@dataclass
class ChatRoomData:
    room_name: str
    chat_room_id: str
    is_private: bool

    def __post_init__(self) -> None:
        enforce_type(self.room_name, str)
        enforce_type(self.chat_room_id, str)
        enforce_type(self.is_private, bool)


@dataclass
class ChatInvitation:
    chat_room_id: str
    invitee_user_id: str
    inviter_user_id: str

    def __post_init__(self) -> None:
        enforce_type(self.chat_room_id, str)
        enforce_type(self.invitee_user_id, str)
        enforce_type(self.inviter_user_id, str)


@dataclass
class MessageData:
    chat_room_id: str
    user_id: str
    content: str

    def __post_init__(self) -> None:
        enforce_type(self.chat_room_id, str)
        enforce_type(self.user_id, str)
        enforce_type(self.content, str)


@dataclass
class PostgresController:
    connection = psycopg2.connect(
        database=POSTGRES_DATABASE,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
    )

    def get_all_table_data(self, table_name: str) -> list[dict[Any, Any]]:
        df = pd.read_sql(sql=f'select * from "{table_name}";', con=self.connection)
        dic_lst = df.to_dict(orient="records")
        return dic_lst

    def get_all_user(self) -> dict[str, UserData]:
        user_dic: dict[str, UserData] = {}

        for data in self.get_all_table_data(DB_TABLE_NAME_USER):
            email, user_id, username = data["email"], data["id"], data["username"]
            if user_dic.get(username) != None:
                raise ValueError("dup username")
            user_dic[username] = UserData(email=email, user_id=user_id, username=username)
        return user_dic

    def get_all_chat_room(self) -> dict[str, ChatRoomData]:
        room_dic: dict[str, ChatRoomData] = {}

        for room in self.get_all_table_data(DB_TABLE_NAME_CHAT_ROOM):
            room_name, chat_room_id, is_private = (
                room["roomName"],
                room["id"],
                room["isPrivate"],
            )
            if room_dic.get(room_name) != None:
                raise ValueError("dup room name")
            room_dic[room_name] = ChatRoomData(room_name=room_name, chat_room_id=chat_room_id, is_private=is_private)
        return room_dic

    def get_all_message(self) -> dict[str, list[MessageData]]:
        message_dic: dict[str, list[MessageData]] = defaultdict(list)

        for message in self.get_all_table_data(DB_TABLE_NAME_MESSAGE):
            chat_room_id, user_id, content = (
                message["chatRoomId"],
                message["userId"],
                message["content"],
            )
            message_dic[chat_room_id].append(MessageData(chat_room_id=chat_room_id, user_id=user_id, content=content))
        return message_dic

    def get_all_chat_invitation(self) -> dict[str, list[ChatInvitation]]:
        invitation_dic: dict[str, list[ChatInvitation]] = defaultdict(list)

        for invitation in self.get_all_table_data(DB_TABLE_NAME_CHAT_INVITATION):
            chat_room_id, invitee_user_id, inviter_user_id = (
                invitation["chatRoomId"],
                invitation["inviteeUserId"],
                invitation["inviterUserId"],
            )
            invitation_dic["chat_room_id"].append(
                ChatInvitation(
                    chat_room_id=chat_room_id,
                    invitee_user_id=invitee_user_id,
                    inviter_user_id=inviter_user_id,
                )
            )
        return invitation_dic

    def get_all_chat_room_msg(self, room_name: str) -> list[MessageData]:
        room_dic = self.get_all_chat_room()
        all_msg_dic = self.get_all_message()

        chat_room_id = room_dic[room_name].chat_room_id
        msg_lst = all_msg_dic.get(chat_room_id) or []
        return msg_lst

    def get_all_chat_room_invitation(self, room_name: str) -> list[ChatInvitation]:
        room_dic = self.get_all_chat_room()
        all_invitation_dic = self.get_all_chat_invitation()

        chat_room_id = room_dic[room_name].chat_room_id
        invitation_lst = all_invitation_dic.get(chat_room_id) or []
        return invitation_lst


postgres_ctl = PostgresController()
