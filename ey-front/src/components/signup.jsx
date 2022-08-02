import Joi from "joi";
import { useFormik } from "formik";
import { formikValidateUsingJoi } from "../utils/formikValidateUsingJoi";
import Input from "./common/input";
import PageHeader from "./common/pageHeader";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import { NavLink } from "react-router-dom";

const SignUp = ({ redirect }) => {
  const navigate = useNavigate();
  const { user, createUser } = useAuth();

  const [error, setError] = useState("");

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validate: formikValidateUsingJoi({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
      password: Joi.string().min(6).required().label("Password"),
      name: Joi.string().min(2).required().label("Name"),
    }),
    async onSubmit(values) {
      try {
        await createUser({ ...values, admin: false });

        toast("Your account is ready 👏");

        if (redirect) {
          navigate(redirect);
        }
      } catch ({ response }) {
        if (response?.status === 400) {
          setError(response.data);
        }
      }
    },
  });

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <PageHeader title="Sign up to EY's user management interface" description="Start a new account" />

      <form noValidate autoComplete="off" onSubmit={form.handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <Input type="email" label="Email" error={form.touched.email && form.errors.email} {...form.getFieldProps("email")} />
        <Input type="password" label="Password" error={form.touched.password && form.errors.password} {...form.getFieldProps("password")} />
        <Input type="text" label="Name" error={form.touched.name && form.errors.name} {...form.getFieldProps("name")} />

        <div className="my-2">
          <button type="submit" disabled={!form.isValid} className="btn btn-primary me-1">
            Sign Up
          </button>
          <button className="btn btn-primary btn-block">
            <NavLink to="../signin" className="nav-link">
              Already have an account
            </NavLink>
          </button>
        </div>
      </form>
    </>
  );
};

export default SignUp;
