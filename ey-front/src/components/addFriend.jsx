import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usersService from "../services/usersService";

const AddFriend = () => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const AddUserFriend = async () => {
      try {
        await usersService.addFriendById(params.id);
        navigate("/");
      } catch {
        navigate("/");
      }
    };

    AddUserFriend();
  }, []);

  return null;
};

export default AddFriend;
