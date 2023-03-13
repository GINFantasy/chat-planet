/*
 * @Description: api集合
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 09:55:03
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 13:47:14
 */
import Request from './request'
import qs from 'qs'
const DOMAIN = import.meta.env.VITE_BASE_API;  // 接口根路径

export const API = {
    // 登录注册
    login:'/login',
    register:'/user/register',

    // 聊天
    getFriendRecord:'/record/getRecord',
    getGroupRecord:'/record/getGroupRecord',
    uploadImg:'record/postImg',
    
    // 管理
    getFriendList:'/friend/friendList',
    getGroupList:'/group/groupList',
    searchFriend:'/user/userList',
    addFriend:'/friend/addFriend',
    delFriend:'/friend/deleteFriend',
    createGroup:'/group/createGroup',
    searchGroup:'/group/searchGroup',
    joinGroup:'/group/joinGroup',
    uploadAvatar:DOMAIN+'user/updateAvatar'
}

export const LoginReq = {
    login:(param:{username:string,password:string}) => {
        return Request.post(`${API.login}`,param);
    },
    register:(param:{nickname:string,password:string}) => {
        return Request.post(`${API.register}`,param);
    },
}

export const MainReq = {
    getFriendList:(id:number) => {
        return Request.get(`${API.getFriendList}?userId=${id}`);
    },
    getGroupList:(id:number) => {
        return Request.get(`${API.getGroupList}?userId=${id}`);
    },
    getFriendRecord:(param:{userId:number | undefined,targetId:number,pageNum:number,pageSize:number}) => {
        let query = qs.stringify(param);
        return Request.get(`${API.getFriendRecord}?${query}`);
    },
    getGroupRecord:(param:{userId:number | undefined,groupId:number,pageNum:number,pageSize:number}) => {
        let query = qs.stringify(param);
        return Request.get(`${API.getGroupRecord}?${query}`);
    },
    searchFriend:(nickname:string) => {
        return Request.get(`${API.searchFriend}/${nickname}`);
    },
    addFriend:(param:{initiatedId:number,acceptedId:number}) => {
        return Request.post(API.addFriend,param);
    },
    delFriend:(param:{initiatedId:number,acceptedId:number}[]) => {
        return Request.post(API.delFriend,param);
    },
    createGroup:(param:{ownerId:number,groupName:string}) => {
        return Request.post(API.createGroup,param);
    },
    searchGroup:(groupName:string) => {
        return Request.get(`${API.searchGroup}?groupName=${groupName}`);
    },
    joinGroup:(param:{memberId:number,groupId:number}) => {
        return Request.post(API.joinGroup,param);
    },
}
