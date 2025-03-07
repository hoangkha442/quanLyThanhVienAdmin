const USER_LOCAL = "USER_LOCAL";

interface UserData {
  role: string;
  token: string;
}

export const userLocalStorage = {
  set: (userData: UserData) => localStorage.setItem(USER_LOCAL, JSON.stringify(userData)), 
  get: (): UserData | null => {
    const storedData = localStorage.getItem(USER_LOCAL);
    return storedData ? JSON.parse(storedData) as UserData : null;
  },
  remove: () => localStorage.removeItem(USER_LOCAL),
};
