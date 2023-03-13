/*
 * @Description:
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 09:49:37
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2023-03-08 18:49:01
 */
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import "./assets/styles/App.scss";
import Login from "./pages/Login";
import { createContext, useEffect, useRef, useState } from "react";
import { User, UserContextType } from "./custom_types/Log";
import Monitor from "./utils/monitor";
import store from "./Store";
export const UserContext = createContext<UserContextType | null>(
  {} as UserContextType
);
const defaultUser = {
  userInfo: {
    name: "",
    id: -1,
    avatar: "",
  },
  token: "",
};
function App() {
  const [user, setUser] = useState<User>(
    store.getItem("chatUserInfo") || defaultUser
  );
  const monitor = useRef<Monitor | null>(null);
  useEffect(() => {
    monitor.current = new Monitor({
      url: "www.123.com",
      name: "chat",
    });
    monitor.current.listenError();
  }, [monitor]);
  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/*" element={<Layout />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
