import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import "../styles/User.css";
import { useAuth } from "../context/auth.context";

const User = ({ user: { _id, name, email, admin }, friends, setChat }) => {
  const userClass = admin ? "user admin" : "user";
  const isFriend = friends.find((friend) => friend == _id);
  const friendClass = isFriend ? "friend" : "regular";
  const { user } = useAuth();

  const handleClick = () => {
    const chatId = user.email > email ? `${user.email}+${email}` : `${email}+${user.email}`;
    setChat(chatId);
  };

  return (
    <div className={userClass}>
      <Avatar src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg" />
      <span className="">
        {name} | {email}
      </span>

      {admin && (
        <div className="adminNote">
          <i className="bi bi-person-fill"></i>
          <a>admin user</a>
        </div>
      )}
      <div className="userActions">
        {user._id != _id && isFriend && (
          <button onClick={handleClick}>
            <i className="bi bi-chat-left-dots-fill"></i>
          </button>
        )}
        {user._id != _id && (
          <button className={friendClass}>
            {isFriend && (
              <Link to={`/users/friends/remove/${_id}`} className="colorize">
                <i className="bi bi-person-check-fill"></i>
              </Link>
            )}
            {!isFriend && (
              <Link to={`/users/friends/add/${_id}`} className="colorize">
                <i className="bi bi-person-plus-fill"></i>
              </Link>
            )}
          </button>
        )}
        {user.admin && (
          <>
            <button className="edit">
              <Link to={`/users/edit/${_id}`} className="colorize">
                <i className="bi bi-pencil-fill"></i>
              </Link>
            </button>
            {user._id != _id && (
              <button className="delete">
                <Link to={`/users/delete/${_id}`} className="colorize">
                  <i className="bi bi-trash-fill"></i>
                </Link>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default User;
