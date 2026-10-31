export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

const USERS_KEY = 'dh_all_users';
const CURRENT_USER_ID_KEY = 'dh_current_user_id';

export const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr_demo',
  name: 'Luis Otávio (Demo TDAH)',
  email: 'luisotavio@example.com',
  createdAt: new Date().toISOString(),
};

export function getAllUsers(): UserProfile[] {
  const saved = localStorage.getItem(USERS_KEY);
  if (!saved) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
    return [DEFAULT_DEMO_USER];
  }
  return JSON.parse(saved);
}

export function getCurrentUser(): UserProfile {
  const currentId = localStorage.getItem(CURRENT_USER_ID_KEY);
  const allUsers = getAllUsers();
  const found = allUsers.find((u) => u.id === currentId);
  if (found) return found;

  // Default to first user or demo
  localStorage.setItem(CURRENT_USER_ID_KEY, DEFAULT_DEMO_USER.id);
  return DEFAULT_DEMO_USER;
}

export function setCurrentUser(userId: string): UserProfile {
  const allUsers = getAllUsers();
  const found = allUsers.find((u) => u.id === userId);
  if (found) {
    localStorage.setItem(CURRENT_USER_ID_KEY, found.id);
    return found;
  }
  return getCurrentUser();
}

export function createNewUserAccount(name: string, email: string): UserProfile {
  const allUsers = getAllUsers();
  const newId = `usr_${Date.now()}`;
  const newUser: UserProfile = {
    id: newId,
    name: name.trim() || 'Usuário TDAH',
    email: email.trim().toLowerCase() || `user_${Date.now()}@app.com`,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...allUsers, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(CURRENT_USER_ID_KEY, newId);

  // Initialize strictly ZERO balance and CLEAN agenda for new users
  localStorage.setItem(`dh_user_${newId}_balance`, '0.00');
  localStorage.setItem(`dh_user_${newId}_tasks`, JSON.stringify([]));
  localStorage.setItem(`dh_user_${newId}_routines`, JSON.stringify([
    {
      id: `r_med_${newId}`,
      title: 'Tomar medicação no horário',
      base_reward: 10,
      base_penalty: 25,
      is_mandatory: true,
      category: 'Saúde',
      completed_dates: [],
    },
    {
      id: `r_bed_${newId}`,
      title: 'Arrumar a cama ao acordar',
      base_reward: 5,
      base_penalty: 10,
      is_mandatory: false,
      category: 'Casa',
      completed_dates: [],
    }
  ]));
  localStorage.setItem(`dh_user_${newId}_transactions`, JSON.stringify([]));
  localStorage.setItem(`dh_user_${newId}_stats`, JSON.stringify({
    balance: 0.00,
    total_earned: 0.00,
    total_penalties: 0.00,
    total_overtime_bonus: 0.00,
    streak_days: 0,
  }));

  return newUser;
}
