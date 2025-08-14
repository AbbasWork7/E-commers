import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs'; // npm install bcryptjs

const AuthContext = createContext();
const USERS_STORAGE_KEY = 'registered_users';

// Load users from localStorage
const initializeUsers = () => {
  try {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
  } catch (error) {
    console.error('Error loading users data:', error);
    return [];
  }
};

// Safely set item
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

// Prune user data to keep only needed fields
const pruneUserData = (userData) => {
  if (!userData) return null;

  return {
    user_id: userData.user_id || userData.id,
    id: userData.id,
    name: userData.name,
    email: userData.email,
    username: userData.username,
    phone_number: userData.phone_number,
    profile_picture: userData.profile_picture || userData.profileImage,
    roles: userData.roles,
    status: userData.status,
    bio: userData.bio,
  };
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  });

  const [users, setUsers] = useState(() => initializeUsers());

  useEffect(() => {
    if (user) {
      const pruned = pruneUserData(user);
      safeSetItem('currentUser', JSON.stringify(pruned));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  useEffect(() => {
    if (users.length > 0) {
      const prunedUsers = users.map(u => pruneUserData(u));
      safeSetItem(USERS_STORAGE_KEY, JSON.stringify(prunedUsers));
    }
  }, [users]);

  const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
  };

  const signup = async (name, email, password, username) => {
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    if (users.some(u => u.username === username)) {
      throw new Error('Username already taken');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: Date.now(),
      name,
      email,
      username,
      password: hashedPassword,
      profile_picture: 'https://via.placeholder.com/150',
    };

    setUsers(prev => [...prev, newUser]);

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);

    return { success: true, user: safeUser };
  };

  const login = async (userInput, password) => {
    const trimmedInput = userInput.trim();
    const trimmedPassword = password.trim();

    if (!trimmedInput || !trimmedPassword) {
      throw new Error('Please fill in all fields');
    }

    const foundUser = users.find(u =>
      u.username.toLowerCase() === trimmedInput.toLowerCase() ||
      u.email.toLowerCase() === trimmedInput.toLowerCase()
    );

    if (!foundUser) {
      throw new Error('Invalid username/email or password');
    }

    const isPasswordValid = await bcrypt.compare(trimmedPassword, foundUser.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username/email or password');
    }

    const { password: _, ...safeUser } = foundUser;
    const prunedUser = pruneUserData(safeUser);
    setUser(prunedUser);
    return prunedUser;
  };

  const loginWithBackendUser = (backendUserData) => {
    const prunedUser = pruneUserData(backendUserData);
    setUser(prunedUser);
    safeSetItem('currentUser', JSON.stringify(prunedUser));
  };

  const updateProfile = async (updatedUserData) => {
    try {
      const prunedUserData = pruneUserData(updatedUserData);
      const updatedUsers = users.map(u =>
        u.id === prunedUserData.id ? { ...u, ...prunedUserData } : u
      );
      setUsers(updatedUsers);
      setUser(prunedUserData);
      return { success: true, user: prunedUserData };
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      signup,
      login,
      loginWithBackendUser,
      logout,
      updateProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
