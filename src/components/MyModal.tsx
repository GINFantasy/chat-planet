/*
 * @Description: 
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-26 18:33:45
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 14:39:52
 */
import React, { useState,useContext } from 'react';
import { Modal, Input,List,Skeleton,Avatar } from 'antd';
import {SearchFriend} from '../custom_types/Log'
import { MainReq } from '../request/api';
import { Button } from 'antd';
import { UserContext } from '../App';
import { UserContextType } from '../custom_types/Log';
import { Message } from '../utils';
const {Search} = Input;
interface ModalProps{
    visible:boolean,
    showModal:Function,
    type:string,
    handleOk:any,
    handleCancel:any,
    notice:Function
}

const MyModal = (props:ModalProps) => {
    const UserCtx:UserContextType | null = useContext(UserContext);
    if(!UserCtx) return <></>
    const {user,setUser} = UserCtx;
    const {userInfo} = user;
    const {visible,handleOk,handleCancel,type,notice} = props;
    const [initLoading,setInitLoading] = useState<boolean>(false);
    const [searchLoading,setSearchLoading] = useState<boolean>(false);
    const [friendList,setFriendList] = useState<SearchFriend[]>([])
    const onSearch = (value:string)=>{
        if(!value) return;
        // 发送请求查找好友
        setSearchLoading(true);
        setInitLoading(true);
        MainReq.searchFriend(value).then(res=>{
            const {data} = res;
            setFriendList(data);
        }).catch(error=>{
            
            throw error;
        }).finally(()=>{
            setSearchLoading(false);
            setInitLoading(false);
        });
    }

    // 添加好友
    const addFriend = (acceptedId:number) => {
        let param = {
            acceptedId,
            initiatedId:userInfo?.id
        }
        // @ts-ignore
        MainReq.addFriend(param).then((res:any)=>{
            if(res.code === 200){
                Message.success('添加成功！');
                notice('add');
            }else{
                Message.warning(res.msg)
            }
        }).catch(error=>{    
            throw error;
        })
    }

    const addContent = <>
        <Search loading={searchLoading} allowClear placeholder="输入添加好友的昵称" onSearch={onSearch} style={{ width: 200 }} />
        <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            dataSource={friendList}
            renderItem={item => (
                <List.Item
                actions={[<Button onClick={()=>addFriend(item.id)} key="add-friend" type='primary'>添加好友</Button>]}
                >
                <Skeleton avatar title={false} active loading={initLoading}>
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={item.nickName}
                    />
                </Skeleton>
                </List.Item>
            )}
        />
    </>
    const detailContent = <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
  

    return (
        <Modal title="Basic Modal" visible={visible} onOk={handleOk} onCancel={handleCancel}>
            {
                type === 'add'
                ?addContent
                :detailContent
            }
        </Modal>
    );
};

export default MyModal;