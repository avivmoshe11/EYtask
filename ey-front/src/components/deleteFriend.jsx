import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usersService from "../services/usersService";

const DeleteFriend = () => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const DeleteUserFriend = async () => {
      try {
        await usersService.removeFriendById(params.id);
        navigate("/");
      } catch {
        navigate("/");
      }
    };

    DeleteUserFriend();
  }, []);

  return null;
};

export default DeleteFriend;
