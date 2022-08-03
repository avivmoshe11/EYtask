import httpService from "./httpService";
import jwtDecode from "jwt-decode";

const TOKEN_KEY = "token";
setTokenHeader();

function setTokenHeader() {
  httpService.setCommonHeader("x-auth-token", getJWT());
}

export function createUser(user) {
  return httpService.post("/users", user);
}

export function createUserByAdmin(user) {
  return httpService.post("/users/admin/add", user);
}

export async function loginUser(credentials) {
  const { data } = await httpService.post("/auth", credentials);

  localStorage.setItem(TOKEN_KEY, data.token);
  setTokenHeader();
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  setTokenHeader();
}

export function getJWT() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    const token = getJWT();
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function getAllUsers() {
  return httpService.get("/users");
}

export function getAllFriends() {
  return httpService.get("/users/friends");
}

export function getUserById(id) {
  return httpService.get(`/users/${id}`);
}

export function editUser(id, user) {
  return httpService.put(`/users/${id}`, user);
}

export function deleteUserById(id) {
  return httpService.delete(`/users/${id}`);
}

export function addFriendById(id) {
  return httpService.put(`/users/friends/add/${id}`);
}

export function removeFriendById(id) {
  return httpService.delete(`/users/friends/remove/${id}`);
}
const usersService = {
  createUser,
  loginUser,
  logout,
  getJWT,
  getUser,
  getAllUsers,
  getAllFriends,
  getUserById,
  editUser,
  deleteUserById,
  addFriendById,
  removeFriendById,
  createUserByAdmin,
};

export default usersService;
