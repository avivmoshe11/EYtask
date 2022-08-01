import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usersService from "../services/usersService";

const DeleteUser = () => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteUser = async () => {
      try {
        await usersService.deleteUserById(params.id);
        navigate("/");
      } catch {
        navigate("/");
      }
    };

    deleteUser();
  }, []);

  return null;
};

export default DeleteUser;
