import { NavigateFunction, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getUserFromStorage } from "../util/LocalStorage";
import { login } from "../services/auth.service";
import React, { useState } from "react";
import '../style/login.css';
import swal from "sweetalert";
import * as Yup from "yup";

const LoginPage: React.FC = () => {
  let navigate: NavigateFunction = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues = {
    username: "",
    password: "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string()
        .test(
          "len",
          "The password must be between 6 and 40 characters.",
          (val: any) =>
            val && val.toString().length >= 6 && val.toString().length <= 40
        )
        .required("This field is required!"),
    });
  };
  const handleSubmit = async (formValue: {
    username: string;
    password: string;
  }) => {
    const { username, password } = formValue;
    setMessage("");
    setIsSubmitting(true);

    const responseMessage = await login(username, password);
    setMessage(responseMessage);

    if (
      responseMessage === "Login successful!" ||
      getUserFromStorage() != null
    ) {
      // Kiểm tra nếu đăng nhập thành công
      const willDelete = await swal({
        text: "login successfull!",
        icon: "success",
        dangerMode: true,
      });
      if (willDelete) {
        navigate("/admin");
        window.location.reload();
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Field name="username" type="text" className="form-control" />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="form-control"
                  onFocus ={() => setMessage("")}
                  onKeyPress={() => setMessage("")}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting}
                >
                  <span>Login</span>
                </button>
              </div>
              {message !== "" && message !== "Login successful!" && (
                <div className="form-group">
                  <div
                    className={"alert alert-danger"}
                    role="alert"
                    style={{ textAlign: "center" }}
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
