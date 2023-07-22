import { useUserProfileModal } from '@/hooks/useUserProfileModal';
import { UserProfileModal } from '@/features/user/components/UserProfile';

import { useRanking } from '../api/useRanking';

export const Ranking = () => {
  const { ranking } = useRanking();
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();

  return (
    <>
      <h3>Ranking</h3>
      <br />
      <UserProfileModal userInfo={selectingUser} {...modal} />
      {ranking.map((rankingInfo, idx) => (
        <p
          onClick={() => {
            openUserProfileModal(rankingInfo.userData);
          }}
          key={idx}
        >
          {rankingInfo.userData.username} {rankingInfo.rating}
        </p>
      ))}
    </>
  );
};
