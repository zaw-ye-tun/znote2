// XP calculation utilities

export const XP_REWARDS = {
  COMPLETE_TASK: 5,
  CREATE_NOTE: 2,
  ADD_EVENT: 1,
  DAILY_LOGIN: 10,
  WEEKLY_STREAK: 20,
};

export const calculateLevel = (xp) => {
  // Every 100 XP = 1 level
  return Math.floor(xp / 100) + 1;
};

export const getXpForNextLevel = (currentXp) => {
  const currentLevel = calculateLevel(currentXp);
  const nextLevelXp = currentLevel * 100;
  return nextLevelXp - currentXp;
};

export const getAvatarShape = (level) => {
  if (level <= 4) return 'dot';
  if (level <= 9) return 'circle';
  if (level <= 14) return 'triangle';
  if (level <= 19) return 'square';
  return 'hexagon';
};

export const calculateStreak = (lastLogin) => {
  const now = new Date();
  const last = new Date(lastLogin);
  
  // Reset time to midnight for accurate day comparison
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(now - last);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
