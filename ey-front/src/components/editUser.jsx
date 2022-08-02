import { useState, useEffect } from "react";
import Joi from "joi";
import PageHeader from "./common/pageHeader";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import Input from "./common/input";
import formikValidateUsingJoi from "../utils/formikValidateUsingJoi";
import { useNavigate, useParams } from "react-router-dom";
import usersService from "../services/usersService";
import { pickKeys } from "../utils/pickKeys";

const EditUser = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    async function getUser() {
      const { data } = await usersService.getUserById(id);
      form.setValues(pickKeys(data, ["name", "email", "admin"]));
    }

    getUser();
  }, [id]);

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      name: "",
      email: "",
      admin: false,
    },
    validate: formikValidateUsingJoi({
      name: Joi.string().min(2).required().label("Name"),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
      admin: Joi.boolean().label("Admin"),
    }),
    async onSubmit(values) {
      try {
        await usersService.editUser(id, values);
        toast("The user was updated 👏");
        navigate("/");
      } catch ({ response }) {
        if (response?.status === 400) {
          setError(response.data);
        }
      }
    },
  });

  return (
    <>
      <PageHeader title="Edit User" />

      <form noValidate autoComplete="off" onSubmit={form.handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <Input type="text" label="Name" error={form.touched.name && form.errors.name} {...form.getFieldProps("name")} />
        <Input type="email" label="Email" error={form.touched.email && form.errors.email} {...form.getFieldProps("email")} />
        <div className="form-group">
          <label htmlFor="Admin" className="form-label">
            Admin
          </label>
          <input
            id="Admin"
            name="admin"
            type="checkbox"
            checked={form.getFieldProps("admin").value}
            onChange={(e) => form.setFieldValue("admin", !form.getFieldProps("admin").value)}
          />
        </div>
        <div className="my-2">
          <button type="submit" disabled={!form.isValid} className="btn btn-primary me-1">
            Edit User
          </button>
        </div>
      </form>
    </>
  );
};

export default EditUser;
