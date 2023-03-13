/*
 * @Description: 类型定义
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 16:06:41
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 13:08:51
 */

// 用户
interface UserInfo{
  name:string,
  id:number,
  avatar:string
}
export interface User{
  userInfo:UserInfo,
  token:string
}

// 朋友
export interface Friend{
  user:UserInfo,          // 朋友的信息 
}

// 聊天记录
export interface ChatRecord{
  direction:number,   // 发送方向：0表示接收，1表示发出
  source:number | undefined,      // 发送者名字
  target:number,      // 接收者名字
  time:string,        // 发送时间
  content:string,      // 内容
  avatar?:string,
  sourceName?:string
}

// 聊天信息
export interface ChatObject{
  userid:number,
  nickName:string,
  avatar:string,
  record:ChatRecord[],  // 聊天记录
}

export interface GroupObject{
  groupid:number,
  groupName:string | undefined,
  record:ChatRecord[],
}

// 消息类型
export interface ChatMessage{
  content:string,
  username:string,
  direction:number
}


export interface Group{
  groupName:string,
  id:number,
  ownerId:number
}

export interface FriendListItem{
  friendId:number,
  friendName:string,
  userId:number,
  avatar:string,
  online:boolean
}

export interface SearchFriend{
  id: number,
  nickName: string,
  avatar:string
}

export interface UserContextType{ 
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>> 
}

export interface WsMessage {
  
}