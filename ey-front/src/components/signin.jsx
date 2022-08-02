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
//import { useLoginUserMutation } from "../store/authStore";
//import { useEffect } from "react";
//import { useAppDispatch } from "../../../for-redux_inactive/hooks/authHooks";
//import { setUser } from "../features/authSlice";
//import jwtDecode from "jwt-decode";

const SignIn = ({ redirect }) => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  //const [loginUser, { data: loginData, isSuccess: isLoginSuccess, isError: isLoginError, error: loginError }] = useLoginUserMutation();
  const [error, setError] = useState("");
  //const dispatch = useAppDispatch();

  // const handleLogin = async (values) => {
  //   return await loginUser(values);
  // };

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
      //const data = await login(values);
      //const info = await handleLogin(values);

      // if (info.error) {
      //   setError(info.error.data);
      // } else {
      //   toast(`Hey, Good to see you 😎`);
      //   dispatch(setUser({ user: jwtDecode(info.data.token), token: info.data.token }));
      //   console.log(info.data.token, jwtDecode(info.data.token));
      //   if (redirect) {
      //     navigate(redirect);
      //   }
      // }
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
