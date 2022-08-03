import Joi from "joi";
import { useFormik } from "formik";
import { formikValidateUsingJoi } from "../utils/formikValidateUsingJoi";
import Input from "./common/input";
import PageHeader from "./common/pageHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const UserAddByAdmin = () => {
  const navigate = useNavigate();
  const { user, createUser } = useAuth();
  const [error, setError] = useState("");

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
      name: "",
      admin: false,
    },
    validate: formikValidateUsingJoi({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
      password: Joi.string().min(6).required().label("Password"),
      name: Joi.string().min(2).required().label("Name"),
      admin: Joi.boolean().label("Admin"),
    }),
    async onSubmit(values) {
      try {
        await createUserByAdmin({ ...values });

        toast("New account is ready 👏");

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
      <PageHeader title="Add User By Admin" description="Admin user management interface: add user" />

      <form noValidate autoComplete="off" onSubmit={form.handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <Input type="email" label="Email" error={form.touched.email && form.errors.email} {...form.getFieldProps("email")} />
        <Input type="password" label="Password" error={form.touched.password && form.errors.password} {...form.getFieldProps("password")} />
        <Input type="text" label="Name" error={form.touched.name && form.errors.name} {...form.getFieldProps("name")} />
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
            Add User
          </button>
        </div>
      </form>
    </>
  );
};

export default UserAddByAdmin;
