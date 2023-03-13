/*
 * @Description: 消息内容
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 19:30:12
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 14:14:48
 */

import { ChatObject ,FriendListItem,GroupObject} from "../custom_types/Log" 
import { useContext, useEffect } from "react";
import { debounce,handleScrollTop } from "../utils";
import Bubble from "./Bubble";
import '../assets/styles/ChatContent.scss'
import { nanoid } from "nanoid";
import { UserContext } from '../App';
import { UserContextType } from '../custom_types/Log';
export default function ChatContent(props:{object:ChatObject | GroupObject,className:string,getRecord:Function,bind:number}){
    const UserCtx:UserContextType | null = useContext(UserContext);
    if(!UserCtx) return <></>
    const {user,setUser} = UserCtx;
    const {userInfo} = user;
    const {object,className,getRecord,bind} = props;
    const {record} = object;
    const addScrollEvent = (dom:any)=>{
        dom.onscroll = debounce(() => handleScrollTop(dom,getRecord), 500)
    }
    const removeScrollEvent = (dom:any)=>{
        dom.onscroll = null;
    }

    useEffect(()=>{
        return ()=>{
            const dom = document.querySelector(`.${className}`);
            if(dom){
                removeScrollEvent(dom);
            }
        }
    },[])

    useEffect(()=>{
        const dom = document.querySelector(`.${className}`);
        if(dom){
            removeScrollEvent(dom);
            addScrollEvent(dom);
        }
    },[bind])

    return <div className={className}>
        {
            // @ts-ignore
            record.map(v =><Bubble name={v.sourceName} myavatar={userInfo?.avatar} avatar={v.avatar} key={nanoid()} data={v}/>)
        }
    </div>
}