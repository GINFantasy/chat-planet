/*
 * @Description: 登录页
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 10:03:34
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2023-03-08 18:56:38
 */

import { MouseEvent, useContext, useRef, useState } from "react";
import "../assets/styles/Login.scss";
import astronauts from "../assets/images/astronauts.png";
import astronaut from "../assets/images/astronaut.png";
import userLogo from "../assets/images/user.png";
import pw from "../assets/images/password.png";
import { UserContext } from "../App";
import { UserContextType } from "../custom_types/Log";
import { LoginReq } from "../request/api";
import { Message } from "../utils";
import { useNavigate } from "react-router-dom";
import store from "../Store/index";

export default function Login() {
  const navigate = useNavigate();
  const UserCtx: UserContextType | null = useContext(UserContext);
  const loginUsername = useRef(null);
  const loginPw = useRef(null);
  const regUsername = useRef(null);
  const regPw1 = useRef(null);
  const regPw2 = useRef(null);
  if (!UserCtx) return <></>;
  const { user, setUser } = UserCtx;

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const switchLogin = (e: MouseEvent) => {
    const { type } = (e.target as HTMLElement).dataset;
    if (type === "1") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  const checkInput = (
    param: {
      username?: string;
      nickname?: string;
      password: string;
      password2?: string;
    },
    type: string
  ) => {
    const { nickname, password, password2, username } = param;
    if (type === "login") {
      if (!username || !password) {
        Message.warning("格式非法，请重新输入！");
        return false;
      }
    } else {
      if (!nickname || !password) {
        Message.warning("格式非法，请重新输入！");
        return false;
      } else if (password2 !== password) {
        Message.warning("两次密码输入不一致，请重新输入！");
        return false;
      }
    }
    return true;
  };

  const register = () => {
    const usernameObj: any = regUsername.current;
    const pwObj1: any = regPw1.current;
    const pwObj2: any = regPw2.current;
    if (!pwObj1 || !pwObj2 || !usernameObj) return;
    let param = {
      nickname: usernameObj.value,
      password: pwObj1.value,
      username: usernameObj.value,
    };
    if (checkInput({ ...param, password2: pwObj2.value }, "register")) {
      LoginReq.register(param)
        .then((res: any) => {
          console.log(res);

          const { code, msg } = res;
          if (code === 200) {
            setIsLogin(true);
            Message.success("注册成功，现在可以登录了！");
          } else {
            Message.error(msg);
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const login = () => {
    const usernameObj: any = loginUsername.current;
    const pwObj: any = loginPw.current;
    if (!pwObj || !usernameObj) return;
    let param = { username: usernameObj.value, password: pwObj.value };
    if (checkInput(param, "login")) {
      LoginReq.login(param)
        .then(async (res: any) => {
          const { code, msg, data } = res;
          if (code !== 200) {
            Message.error(msg);
          } else {
            await setUser(data);
            store.setItem("chatUserInfo", data);
            Message.success("登录成功！");
            navigate(`/index/chat`);
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="switch">
        <span
          className={`Login${isLogin ? "" : " switch-active"}`}
          onClick={switchLogin}
          data-type="1"
        >
          Login
        </span>
        <span
          className={`Signup${isLogin ? " switch-active" : ""}`}
          onClick={switchLogin}
          data-type="2"
        >
          Sign up
        </span>
      </div>
      <div className="content">
        <div className="welcome">
          <img
            src={astronauts}
            className="astr"
            style={{ opacity: isLogin ? 1 : 0 }}
          />
          <img
            src={astronaut}
            className="astr"
            style={{ opacity: isLogin ? 0 : 1 }}
          />
          <span className="word" style={{ opacity: isLogin ? 1 : 0 }}>
            Let's go!
          </span>
          <span className="word" style={{ opacity: isLogin ? 0 : 1 }}>
            Join us!
          </span>
        </div>
        <div className="input-area">
          <form
            action=""
            className="login"
            style={{ display: isLogin ? "block" : "none" }}
          >
            <div className="inputWrapper">
              <input
                ref={loginUsername}
                type="text"
                placeholder="User's Name"
                style={{ backgroundImage: `url(${userLogo})` }}
                className="user-name text"
              />
              <span className="line"></span>
            </div>
            <div className="inputWrapper">
              <input
                ref={loginPw}
                type="password"
                placeholder="Password"
                style={{ backgroundImage: `url(${pw})` }}
                className="password text"
              />
              <span className="line"></span>
            </div>
            <input
              onClick={login}
              type="button"
              value="LOGIN"
              className="btn"
            />
          </form>

          <form
            action=""
            className="register"
            style={{ display: isLogin ? "none" : "block" }}
          >
            <div className="inputWrapper">
              <input
                ref={regUsername}
                type="text"
                placeholder="User's Name"
                style={{ backgroundImage: `url(${userLogo})` }}
                className="user-name text"
              />
              <span className="line"></span>
            </div>

            <div className="inputWrapper">
              <input
                ref={regPw1}
                type="password"
                placeholder="Password"
                style={{ backgroundImage: `url(${pw})` }}
                className="password text"
              />
              <span className="line"></span>
            </div>
            <div className="inputWrapper repassword">
              <input
                ref={regPw2}
                type="password"
                placeholder="Repeat your password"
                style={{ backgroundImage: `url(${pw})` }}
                className="password text"
              />
              <span className="line"></span>
            </div>
            <input
              onClick={register}
              type="button"
              value="SIGN UP"
              className="btn signup-btn"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
