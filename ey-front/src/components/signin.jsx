import { useState } from "react";
import Joi from "joi";
import PageHeader from "./common/pageHeader";
import { useFormik } from "formik";
import Input from "./common/input";
import formikValidateUsingJoi from "../utils/formikValidateUsingJoi";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = ({ redirect }) => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [error, setError] = useState("");

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate: formikValidateUsingJoi({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
      password: Joi.string().min(6).required().label("Password"),
    }),
    async onSubmit(values) {
      try {
        const data = await login(values);
        toast(`Hey ${data.name}, Good to see you 😎`);

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
    //user
    return <Navigate to="/" />;
  }

  return (
    <>
      <PageHeader title="Sign in to EY's user management interface" description="Sign in to your account" />

      <form noValidate onSubmit={form.handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <Input type="email" label="Email" error={form.touched.email && form.errors.email} {...form.getFieldProps("email")} />
        <Input type="password" label="Password" error={form.touched.password && form.errors.password} {...form.getFieldProps("password")} />

        <div className="my-2">
          <button type="submit" disabled={!form.isValid} className="btn btn-primary me-1">
            Sign In
          </button>
          <button className="btn btn-primary btn-block">
            <NavLink to="../signup" className="nav-link">
              I'm new
            </NavLink>
          </button>
        </div>
      </form>
    </>
  );
};
export default SignIn;
