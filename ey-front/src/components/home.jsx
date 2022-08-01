import PageHeader from "./common/pageHeader";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import Users from "./users";
import User from "./user";
import { useState, useEffect } from "react";
import usersService from "../services/usersService";
import "../styles/Home.css";
import ChatApp from "./chat";
import { useGetUsersQuery } from "../store/store";

const Home = ({ redirect }) => {
  // const [friends, setFriends] = useState([]);
  const [chat, setChat] = useState("");
  const { data: friends } = useGetUsersQuery();

  // useEffect(() => {
  //   async function getFriends() {
  //     const { data } = await usersService.getAllFriends();
  //     setFriends(data);
  //     console.log(data);
  //   }
  //   getFriends();
  // }, []);

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
      <Users friends={friends} setFriends={setFriends} chat={chat} setChat={setChat} />
      <ChatApp privateChat={chat} />
    </>
  );
};

export default Home;
