import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, password) => {
    // Mock login logic
    console.log(`Logging in with ${email}`);
    // Simulate successful login
    const mockUser = {
      id: '1',
      name: 'Test Artist',
      email: email,
      role: 'artist'
    };
    set({ user: mockUser, isAuthenticated: true });
    return true; // Success
  },

  signup: (fullName, username, email, password) => {
    // Mock signup logic
    console.log(`Signing up ${username} (${email})`);
    const mockUser = {
      id: Date.now().toString(),
      name: fullName, // Map Full Name to 'name' for backward compat or just use fullName
      fullName,
      username,
      email,
      role: 'artist'
    };
    set({ user: mockUser, isAuthenticated: true });
    return true;
  },

  updateProfile: (profileData) => {
    set((state) => ({
      user: { ...state.user, ...profileData }
    }));
    return true;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}))
