/*
 * @Description: 好友管理
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-28 18:59:44
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 13:18:18
 */
import { FriendListItem } from '../custom_types/Log'
import { useImmer } from 'use-immer'
import CheckList from "../components/CheckList"
import { useEffect, useState } from "react";
import { useOutletContext } from 'react-router-dom';
import { MainReq } from '../request/api';
import { Message } from '../utils';
export default function FriendManage(){
    const outletContext:any = useOutletContext();
    const userInfo = outletContext[0];
    const [listloading,setListloading] = useState<boolean>(false);
    const [friendlist,updateFriendlist] = useImmer<FriendListItem[]>([]);
    const getFriendList = ()=>{
        MainReq.getFriendList(userInfo.id).then(async (res)=>{
            const {data} = res;
            await updateFriendlist(data)
        }).catch(err=>{
            throw err;
        })
    }

    const notice = (type:string)=>{
        if(type === 'delete'){
            getFriendList();
        }
    }

    useEffect(()=>{
        if(!userInfo?.id){
            setTimeout(() => {
                Message.warning('用户信息缺失，请重新登录！');
            }, 1000);
            return;
        }
        getFriendList();
    },[])

    return <CheckList notice={notice} userid={userInfo.id} loading={listloading} headerTitle='好友管理' type="friend" data={friendlist}/>
}