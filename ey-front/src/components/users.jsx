import User from "./user";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import usersService from "../services/usersService";
import "../styles/Users.css";

const Users = ({ friends, setFriends, chat, setChat }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const { data } = await usersService.getAllUsers();
      setUsers(data);
      console.log(data);
    }

    getUsers();
  }, []);

  return (
    <>
      <br />
      <div className="">
        {!users.length && <h2>No Users</h2>}
        <div className="users">
          {users.map((user) => (
            <User key={user._id} user={user} friends={friends} setChat={setChat} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Users;
