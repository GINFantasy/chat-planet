/*
 * @Description: 路由配置
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 10:03:20
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-05-29 00:03:06
 */
import React from "react"
import Login from "../pages/Login"
import Index from '../pages/Index'
import Chat from '../pages/Chat'
import Manage from '../pages/Manage'
import FriendManage from '../pages/FriendManage'
import GroupManage from '../pages/GroupManage'
interface Route{
    title:string,
    path:string,
    component:React.FunctionComponent<any>,
    children?:Route[]
}
const routes:Route[] = [
    {
        title:"登录",
        path:"/login",
        component: Login
    },
    {
        title:"聊天室",
        path:"/index",
        component: Index,
        children:[
            {
                title:"聊天",
                path:"chat",
                component: Chat
            },
            {
                title:"管理",
                path:"manage",
                component: Manage,
                children:[
                    {
                        title:"好友管理",
                        path:"friendManage",
                        component:FriendManage   
                    },
                    {
                        title:"群聊管理",
                        path:"groupManage",
                        component:GroupManage   
                    },
                ]
            }
        ]
    }
]

export {routes}