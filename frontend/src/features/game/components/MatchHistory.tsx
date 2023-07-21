import { useUserProfileModal } from '@/hooks/useUserProfileModal';
import { UserProfileModal } from '@/features/user/components/UserProfile';
import { UserInfo } from '@/features/user/types/UserDto';

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

export const MatchHistory = () => {
  const { matchHistories } = useMatchHistory();
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();

  return (
    <>
      <h3>MatchHistoryDto</h3>
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
