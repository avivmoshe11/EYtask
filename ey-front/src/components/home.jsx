import PageHeader from "./common/pageHeader";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import Users from "./users";
import { useState, useEffect } from "react";
import usersService from "../services/usersService";
import "../styles/Home.css";
import ChatApp from "./chat";

const Home = ({ redirect }) => {
  const [friends, setFriends] = useState([]);
  const [chat, setChat] = useState("");

  useEffect(() => {
    async function getFriends() {
      const { data } = await usersService.getAllFriends();
      setFriends(data);
    }
    getFriends();
  }, []);

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="signin" />;
  }
  return (
    <>
      <PageHeader
        title={
          <>
            EY <i className="bi bi-bank2"></i> is awesome!
          </>
        }
        description="Welcome to EY users management panel"
      />
      {user.admin && (
        <>
          <br />
          <h4>Admin add-on:</h4>
          <button className="addUser">
            <Link to={`/users/add/`} className="addUserItem">
              <i className="bi bi-plus-square"></i>
              <span className="addUserItem">Add User</span>
            </Link>
          </button>
        </>
      )}
      <Users friends={friends} setFriends={setFriends} chat={chat} setChat={setChat} />
      <ChatApp privateChat={chat} />
    </>
  );
};

export default Home;
