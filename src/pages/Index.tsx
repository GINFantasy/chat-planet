/*
 * @Description: 聊天页
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 13:51:06
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 14:17:00
 */
import '../assets/styles/Index.scss'

import {Outlet, useNavigate} from 'react-router-dom'
import { useContext } from 'react';
import UploadAvatar from '../components/UploadAvatar';
import MyNavLink from '../components/MyNavLink'
import { UserContext } from '../App';
import { UserContextType } from '../custom_types/Log';
import manageLogo from '../assets/images/manage.svg'
import chatLogo from '../assets/images/chat.svg'
import store from '../Store';
import { Message } from '../utils';
export default function Index(){
   
    const UserCtx:UserContextType = useContext(UserContext) as UserContextType;
    const {user,setUser} = UserCtx;
    const {avatar,id} = user.userInfo
    const navigate = useNavigate()
    const logOut = ()=>{
        store.remove('chatUserInfo');
        navigate('/login',{ replace: true })
    }

    return <div className="chat-wrapper">
        <div className="sidebar">
            <div title='更换头像' className="avatar-ct">
                <img src={avatar} alt="头像" />
                <UploadAvatar setUser={setUser} id={id}/>
            </div>
            <div className="menu-list">
                <MyNavLink className='chat-menu' active='chat-menu-active' path='chat' title='聊天' children={<img src={chatLogo}/>}/>
                <MyNavLink className='chat-menu' active='chat-menu-active' path='manage' title='管理' children={<img src={manageLogo}/>}/>
            </div>
            <div className='chat-menu exit' title='注销' onClick={logOut}></div>
        </div>
        <div className="main-ct">
            <Outlet/>
        </div>
    </div>
} 