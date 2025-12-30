import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { baseUrl, signin } from "../services/path";

export const SigninPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    axios
      .post(`${baseUrl}${signin}`, data)
      .then(function (response) {
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        }
      })
      .catch(function (error) {
        if (error.status === 400) {
          console.log(error.response.data.message);
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" {...register("email")} />
        <input type="password" {...register("password")} />
        <input type="submit" />
      </form>
    </div>
  );
};
