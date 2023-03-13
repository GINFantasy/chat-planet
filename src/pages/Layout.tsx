/*
 * @Description: 总体路由控制
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 10:02:20
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-06-26 21:05:36
 */
import { routes } from "../route/index";
import { Route, Routes,Navigate} from "react-router-dom";
import Login from "../pages/Login"
import Index from '../pages/Index'
import Chat from '../pages/Chat'
import Manage from '../pages/Manage'
import FriendManage from '../pages/FriendManage'
import GroupManage from '../pages/GroupManage'
import { nanoid } from "nanoid";
import "../assets/styles/Layout.scss";

export default function Layout() {

  return (
    <div className="wrapper">
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/index' element={<Index/>}>
          <Route path='chat' element={<Chat/>}></Route>
          <Route path='manage' element={<Manage/>}>
            <Route path='friendManage' element={<FriendManage/>}></Route>
            <Route path='groupManage' element={<GroupManage/>}></Route>
            <Route path="" element={<Navigate to='friendManage'/>}></Route>
          </Route>
        </Route>
        <Route path="/*" element={<Navigate to="/index/chat" />} />
      </Routes>
    </div>
  );
}
