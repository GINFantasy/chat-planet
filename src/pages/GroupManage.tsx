/*
 * @Description: 群聊管理
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-29 00:02:06
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 13:18:43
 */
import { Group } from '../custom_types/Log'
import { useImmer } from 'use-immer'
import { MainReq } from '../request/api';
import CheckList from "../components/CheckList";
import { Message } from '../utils';
import { Input } from "antd";
import { useOutletContext } from 'react-router-dom';
import { Button } from 'antd';
import { useState,useEffect,useRef } from "react";
const {Search} = Input;
export default function GroupManage(){
    const outletContext:any = useOutletContext();
    const userInfo = outletContext[0];
    const userid = userInfo.id;
    const [searchLoading,setSearchLoading] = useState<boolean>(false);
    const [listloading,setListloading] = useState<boolean>(false);
    const [grouplist,updateGrouplist] = useImmer<Group[]>([]);
    const inputGroupName = useRef(null)
    const onSearch = (value:string)=>{
        if(!value) return;
        // 发送请求查找群聊
        setSearchLoading(true);
        setListloading(true);
        MainReq.searchGroup(value).then(res=>{
            const {data} = res;
            updateGrouplist(data)
        }).catch(e=>{
            
            throw e;
        }).finally(()=>{
            setSearchLoading(false);
            setListloading(false);
        })
    }

    const createGroup = () => {
        // @ts-ignore
        let groupName = inputGroupName.current.value;
        if(groupName === ''){
          Message.warning('群名不能为空！');
          return;
        }
        let param = {
          ownerId:userid,
          groupName
        };
        // @ts-ignore
        MainReq.createGroup(param).then((res:any)=>{
          if(res.code === 200){
            Message.success('创建成功！');
          }else{
            Message.warning(res.msg);
          }
        }).catch(err=>{
            throw err;
        })
      }

    useEffect(()=>{
        
    },[])

    return <div className="group-manage-ct">
        <div className="group-header">
            <p>创建群聊</p>
            <input className='group-input' type="text" ref={inputGroupName} placeholder="新建群聊名..."/>
            <Button onClick={createGroup} key="create-group" type='primary'>创建群聊</Button>
        </div>
        <div className="group-header">
            <p>加入群聊</p>
            <Search loading={searchLoading} allowClear placeholder="输入群聊名称" onSearch={onSearch} style={{ width: 200 }} />
        </div>
        <CheckList notice={()=>{}} userid={userid} loading={listloading} type="manage" data={grouplist}/>
    </div>
}