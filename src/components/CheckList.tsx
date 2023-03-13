/*
 * @Description: 可选列表
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-27 16:57:52
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 12:52:24
 */
import { ProList } from '@ant-design/pro-list';
import { Button } from 'antd';
import { ReactText } from 'react';
import { FriendListItem,Group } from '../custom_types/Log';
import { useState } from 'react';
import '../assets/styles/CheckList.scss'
import { MainReq } from '../request/api';
import { Message } from '../utils';
interface CheckListProps {
  data:FriendListItem[] | Group[],
  type:string,
  headerTitle?:string,
  loading:boolean,
  userid:number,
  notice:Function
}
const handleData = (dataSource:FriendListItem[] | Group[],type:string)=>{
  if(!dataSource) return [];
  if(type === 'friend'){
    // @ts-ignore
    return dataSource.map((v:FriendListItem)=>{
      return {
        title:v.friendName,
        avatar:v.avatar,
        id:v.friendId
      }
    })
  }else{
    // @ts-ignore
    return dataSource.map((v:Group)=>{
      return {
        title:v.groupName,
        id:v.id
      }
    })
  }
}



export default function CheckList (props:CheckListProps){
  const {data,type,headerTitle,loading,userid,notice} = props;
  const dataSource = handleData(data,type);
  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);  
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: ReactText[]) => setSelectedRowKeys(keys),
  };

  

  const deleteFriend = () => {
    if(selectedRowKeys.length === 0){
      Message.warning('还没有选择要删除的好友哦！')
      return;
    }
    const param = selectedRowKeys.map((acceptedId:any)=>{
      return {
        initiatedId:userid,
        acceptedId
      }
    })
    MainReq.delFriend(param).then((res:any)=>{
      if(res.code === 200){
        Message.success('删除成功！');
        setSelectedRowKeys([]);
        notice('delete');
      }else{
        Message.warning(res.msg);
      }
    }).catch(err=>{
        throw err;
    })
  }

  const joinGroup = (groupId:number)=>{
    let param = {
      memberId:userid,
      groupId
    }
    MainReq.joinGroup(param).then((res:any)=>{
      if(res.code === 200){
        Message.success('加入成功！');
        setSelectedRowKeys([]);
        notice('delete');
      }else{
        Message.warning(res.msg);
      }
    }).catch(err=>{
        throw err;
    })
  }

  const toolBarFriend = [
    <Button onClick={deleteFriend} key='delete' type="primary" danger>删除好友</Button>
  ]
  const toolBarGroup:JSX.Element[] = [];

  return (
    <ProList<{ title: string }>
      toolBarRender={() => {
        return type === 'friend'
        ? toolBarFriend
        : toolBarGroup
      }}
      metas={{
        title: {},
        avatar: {},
        extra: {
       
        },
        actions: {
          render: (text: React.ReactNode,record: any,index: number) => {
            return type === 'friend'
            ? []
            : [<Button onClick={()=>joinGroup(record.id)} key="join-group" type='primary'>加入</Button>]
          },
        },
      }}
      loading={loading}
      split
      rowKey="id"
      headerTitle={headerTitle}
      rowSelection={type === 'friend' ? rowSelection : false}
      dataSource={dataSource}
    />
  );
};