/*
 * @Description: 管理页
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-27 15:11:25
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 14:07:14
 */
import { Outlet } from 'react-router-dom'
import { useState,useContext,useEffect } from 'react'
import { UserContext } from '../App';
import { Message,checkIsLogin } from '../utils';
import { useNavigate } from 'react-router-dom';
import { UserContextType } from '../custom_types/Log';
import MyNavLink from '../components/MyNavLink'
import friend from '../assets/images/friend.svg'
import group from '../assets/images/group.svg'
import '../assets/styles/Manage.scss'
export default function Manage(){
    const navigate = useNavigate();
    const [isLogin,setIsLogin] = useState(false);
    const UserCtx:UserContextType | null = useContext(UserContext);
    if(!UserCtx) return <></>
    const {user} = UserCtx;
    const {userInfo} = user;
    useEffect(()=>{
        if(!checkIsLogin('chatUserInfo')){
            Message.warning('登录过期，请重新登录！');
        }else{
            setIsLogin(true);
        }
        return ()=>{
            
        }
    },[])

    return isLogin
    ?<div className='manage-ct'>
        <div className="manage-sidebar">
            <MyNavLink className='manage-menu-item' active='manage-menu-active' path='friendManage' title='好友管理' value='好友管理' children={<img src={friend}/>}/>
            <MyNavLink className='manage-menu-item' active='manage-menu-active' path='groupManage' title='群聊管理' value='群聊管理' children={<img src={group}/>}/>
        </div>
        <div className="manage-list">
            <Outlet context={[userInfo]}/>
        </div>
    </div>
    :<></>
}