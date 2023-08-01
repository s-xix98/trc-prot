import { useUserProfileModal } from '@/hooks/useUserProfileModal';
import { UserProfileModal } from '@/features/user/components/UserProfile';
import { UserInfo } from '@/features/user/types/UserDto';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useModal } from '@/hooks/useModal';

import { useMatchHistory } from '../api/useMatchHistory';
import { MatchHistoryDto } from '../types/matchHistoryDto';

const ShowMatchResult = ({
  result,
  openUserProfileModal,
}: {
  result: MatchHistoryDto;
  openUserProfileModal: (userInfo: UserInfo) => void;
}) => {
  const p1 = result.player1;
  const p2 = result.player2;

  return (
    <div>
      <span
        style={{ color: result.winner?.id !== p1.id ? 'white' : '' }}
        onClick={() => {
          openUserProfileModal(p1);
        }}
      >
        {p1.username}
      </span>
      <span> -- </span>
      <span
        style={{ color: result.winner?.id !== p2.id ? 'white' : '' }}
        onClick={() => {
          openUserProfileModal(p2);
        }}
      >
        {p2.username}
      </span>
    </div>
  );
};

export const MatchHistoryModal = ({ userInfo }: { userInfo: UserInfo }) => {
  const modal = useModal();

  return (
    <>
      <ModalView {...modal}>
        <MatchHistory userInfo={userInfo} />
      </ModalView>
      <button onClick={() => modal.openModal()}>Match History</button>
    </>
  );
};
export const MatchHistory = ({ userInfo }: { userInfo: UserInfo }) => {
  const { matchHistories } = useMatchHistory(userInfo);
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();

  return (
    <>
      <h3>MatchHistory</h3>
      <br />
      <UserProfileModal userInfo={selectingUser} {...modal} />
      {matchHistories.map((result, idx) => (
        <ShowMatchResult
          key={idx}
          result={result}
          openUserProfileModal={openUserProfileModal}
        />
      ))}
    </>
  );
};

export const MyMatchHistory = () => {
  const { currentUserInfo } = useCurrentUser();

  return (
    <>
      {!currentUserInfo && <p>User not selected</p>}
      {currentUserInfo && <MatchHistory userInfo={currentUserInfo} />}
    </>
  );
};
