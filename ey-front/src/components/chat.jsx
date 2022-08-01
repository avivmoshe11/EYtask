import { setIn } from "formik";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Input from "./common/input";
import { useAuth } from "../context/auth.context";
import "../styles/Chat.css";
const socket = io.connect("http://localhost:3900");

function ChatApp({ privateChat = "" }) {
  const [room, setRoom] = useState(privateChat);
  const [input, setInput] = useState("");
  const [receive, setReceive] = useState("");
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setReceive(msg);
      setMessages((messages) => [...messages, { message: msg, received: true }]);
    });
  }, [socket]);

  useEffect(() => {
    setRoom(privateChat);
    joinRoom();
    setSender(identifySender(privateChat));
    setMessages([]);
  }, [privateChat, room]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const identifySender = (emails) => {
    let splitEmails = emails.split("+");
    if (splitEmails[0] == user.email) return splitEmails[1];
    if (splitEmails[1] == user.email) return splitEmails[0];
    return "";
  };

  const handleKeyPress = (e) => {
    if (e.charCode == 13) {
      handleClick();
    }
  };

  const handleClick = (e) => {
    /*if (contains_heb(input)) {
      const a = input.split("").reverse().join("");
      setInput(a);
    }*/
    if (input !== "") {
      socket.emit("send_message", { input, room });
      setMessages((messages) => [...messages, { message: input, received: false }]);
      setInput("");
    }
  };
  /*const contains_heb = (str) => {
    return /[\u0590-\u05FF]/.test(str);
  };*/

  return (
    <>
      <div className="chat_div">
        <h4>Chat With Your Friends</h4>
        <br />

        {messages.length > 0 && (
          <>
            {messages.map((message, index) => (
              <h6 key={index}>
                {message.received ? <span className="chatSender">{sender}</span> : <span className="chatUser">{user.email}</span>}: {message.message}
              </h6>
            ))}
          </>
        )}
        <input type="text" onChange={(event) => setInput(event.target.value)} onKeyPress={handleKeyPress} value={input}></input>
        <button type="submit" onClick={handleClick} className="input_button">
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </>
  );
}

export default ChatApp;
