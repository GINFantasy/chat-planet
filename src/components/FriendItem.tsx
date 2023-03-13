// @ts-nocheck
/*
 * @Description: 好友或群聊列表项
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-26 08:11:28
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-06-26 16:26:45
 */
import { FriendListItem,Group } from "../custom_types/Log";
import '../assets/styles/FriendItem.scss'
interface FriendItemProps {
    data:FriendListItem | Group,
    openChatBox:Function,
    type:'group' | 'friend',
    className:string,
    active:boolean
}
export default function FriendItem(props:FriendItemProps){
    const {data,className,type,openChatBox,active} = props;

    return (
        type === 'friend'
        ?<div className={`${className}${active?` ${className}-active`:''}`} data-itemid={data.friendId} onClick={()=>openChatBox(data.friendId,type,false)}>
            <div className="avatar">
                <img src={data.avatar} alt="头像" />
            </div>
            <div className="info">
                <span className="name">{data.friendName}</span>
                <span className={`status${data.online?' online':' offline'}`}>{data.online?'在线':'离线'}</span>
            </div>
        </div>
        :<div className={`${className}${active?` ${className}-active`:''}`} data-itemid={data.id} onClick={()=>openChatBox(data.id,type,false)}>
            <div className="avatar">
                <img src='https://aliyun-wkk.oss-cn-beijing.aliyuncs.com/2022/06/01/c1e3029f432340768497f3791a118e8f.png' alt="头像" />
            </div>
            <div className="info">
                <span className="name">{data.groupName}</span>
            </div>
        </div>
    )
}