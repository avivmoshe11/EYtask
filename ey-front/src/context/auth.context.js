import React, { useEffect, useState } from "react";
import usersService from "../services/usersService";
import jwtDecode from "jwt-decode";

export const authContext = React.createContext(null);
authContext.displayName = "Auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(usersService.getUser());

  const refreshUser = () => {
    setUser(usersService.getUser());
  };

  const createUser = (user) => {
    return usersService.createUser(user);
  };

  const login = async (credentials) => {
    const response = await usersService.loginUser(credentials);
    refreshUser();

    return jwtDecode(response.token);
  };

  const logout = () => {
    usersService.logout();
    refreshUser();
  };

  return <authContext.Provider value={{ user, login, logout, createUser }}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return React.useContext(authContext);
};
