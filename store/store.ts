import { create } from 'zustand';

interface UserState {
  user: { name: string; email: string; id: string; userName: string } | null;
  setUser: (user: { name: string; email: string }) => void;
  clearUser: () => void;
}

export const userStore = create<UserState>((set: any) => ({
  // 초기 상태
  user: null,

  // 상태 업데이트 함수
  setUser: (user: any) => set({ user }),

  // 로그아웃 함수
  clearUser: () => set({ user: null }),
}));
