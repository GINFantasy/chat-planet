/*
 * @Description: 聊天
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-27 14:55:44
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2023-03-06 21:37:51
 */
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useImmer } from "use-immer";
import ChatEdit from "../components/ChatEdit";
import ChatContent from "../components/ChatContent";
import { Input, message } from "antd";
import FriendItem from "../components/FriendItem";
import { scrollBottom, Message } from "../utils/index";
import {
  ChatObject,
  ChatRecord,
  FriendListItem,
  GroupObject,
} from "../custom_types/Log";
import { isEmpty, checkIsLogin } from "../utils/index";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Chat.scss";
import { MainReq } from "../request/api";
import { UserContext } from "../App";
import { UserContextType, Group } from "../custom_types/Log";
import { wsUrlDomain } from "../request/request";
import MyModal from "../components/MyModal";
type Ws = WebSocket | null;
const { Search } = Input;
export const ChatObjectContext: any = React.createContext(null);

// 处理websocket的变量
let connect: boolean = false;
let ws: Ws = null;
let exit: boolean = false;
let pageNum = 0;
export default function Chat() {
  const UserCtx: UserContextType = useContext(UserContext) as UserContextType;
  if (!UserCtx) return <></>;
  const { user } = UserCtx;
  const { userInfo, token } = user;
  const wsUrl = `${wsUrlDomain}${userInfo.id}`;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [friendItemId, setFriendItemId] = useState(-1);
  const [groupItemId, setGroupItemId] = useState(-1);
  const [noticeTypeChange, setNoticeTypeChange] = useState(nanoid());
  const [modalType, setModalType] = useState("add");
  const [listType, setListType] = useState("friend");
  const [bind, setBind] = useState<number>(0);
  const [isLogin, setIsLogin] = useState(false);
  const [onlineUser, setOnlineUser] = useState<number[]>([]);
  const [friendList, updateFriendList] = useImmer<FriendListItem[]>([]);
  const [groupList, updateGroupList] = useImmer<Group[]>([]);
  const [chatObject, updateChatObject] = useImmer<ChatObject>({
    userid: -1,
    nickName: "无",
    avatar:
      "http://aliyun-wkml.oss-cn-beijing.aliyuncs.com/img/image-20220530155509651.png",
    record: [],
  });
  const [groupObject, updateGroupObject] = useImmer<GroupObject>({
    groupid: -1,
    groupName: "",
    record: [],
  });
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const closeSocket = () => {
    exit = true;
    ws?.close(); // 关闭
    ws = null;
  };
  const reconnect = (wsUrl: string) => {
    if (connect || exit) return;
    connect = true;
    setTimeout(function () {
      //没连接上会一直重连，设置延迟避免请求过多
      createWebSocket(wsUrl);
      connect = false;
    }, 10000);
  };

  interface HeartCheck {
    timeout: number;
    timeoutObj: number | undefined;
    serverTimeoutObj: number | undefined;
    reset: Function;
    start: Function;
  }
  //心跳检测
  const heartCheck: HeartCheck = {
    timeout: 30000, //1分钟发一次心跳
    timeoutObj: undefined,
    serverTimeoutObj: undefined,
    reset: function () {
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      return this;
    },
    start: function () {
      // @ts-ignore
      this.timeoutObj = setTimeout(function () {
        let heartbeat = {
          type: 7,
          userId: userInfo?.id,
          toUserId: -1,
          toGroupId: -1,
          content: "",
        };
        ws?.send(JSON.stringify(heartbeat));
      }, this.timeout);
    },
  };

  const createWebSocket = (url: string) => {
    try {
      if ("WebSocket" in window) {
        ws = new WebSocket(url, [token]);
        initEventHandle(ws);
      }
    } catch (e) {
      Message.warning("Websocket连接错误，正在重试...");
      reconnect(url);
    }
  };
  // 绑定ws事件
  const initEventHandle = (ws: Ws) => {
    if (!ws) return;
    ws.onclose = function (e) {
      reconnect(wsUrl);
      console.log("连接关闭!", e);
      connect = false;
    };
    ws.onerror = function (res) {
      connect = false;
      Message.warning("Websocket连接错误，正在重试...");
    };
    ws.onopen = function () {
      heartCheck.reset().start(); //心跳检测重置
      console.log("连接成功!");
    };
    ws.onmessage = async (res) => {
      // 如果获取到消息，心跳检测重置
      heartCheck.reset().start();
      // 处理收到的信息
      handleWsRecieve(JSON.parse(res.data));
    };
  };

  const handleWsRecieve = (data: any) => {
    console.log(data);

    const { type, userId, toUserId, content, avatar, nickname } = data;
    console.log(type, toUserId, userInfo);

    switch (type) {
      case 1:
        {
          if (toUserId == userInfo?.id) {
            const record = JSON.parse(content);
            record.avatar = avatar;
            record.sourceName = nickname;
            updateChatObject((pre) => {
              pre.record = [...pre.record, record];
            });
            scrollBottom("chat-content");
          }
        }
        break;
      case 2:
        {
          if (userId != userInfo?.id) {
            data.sourceName = nickname;
            updateGroupObject((pre) => {
              pre.record = [...pre.record, data];
            });
            scrollBottom("chat-content");
          }
        }
        break;
      case 4:
        {
          // 有用户登录
          updateFriendList((pre) => {
            if (!pre) return;
            pre.forEach((v) => {
              if (v.friendId === userId) {
                v.online = true;
              }
            });
          });
        }
        break;
      case 5:
        {
          // 有用户下线
          updateFriendList((pre) => {
            if (!pre) return;
            pre.forEach((v) => {
              if (v.friendId === userId) {
                v.online = false;
              }
            });
          });
        }
        break;
      case 6:
        {
          // 当前在线的用户id数组
          setOnlineUser(JSON.parse(content));
        }
        break;
    }
  };

  useEffect(() => {
    updateFriendList((pre) => {
      if (!pre) return;
      pre.forEach((v) => {
        if (onlineUser.includes(v.friendId)) {
          v.online = true;
        }
      });
    });
  }, [onlineUser, friendList]);

  // 发送消息
  const send = async (content: string | undefined) => {
    if (content === undefined) return;
    if (isEmpty(content)) {
      Message.warning("不能发送空白消息！");
      return;
    }
    if (listType === "friend") {
      let message = {
        direction: 1,
        source: userInfo?.id,
        target: chatObject.userid,
        time: "",
        content,
        sourceName: userInfo?.nickName,
      };
      let wsMessage = {
        type: 1,
        userId: userInfo?.id,
        toUserId: chatObject.userid,
        toGroupId: -1,
        content,
      };
      console.log(userInfo);

      ws?.send(JSON.stringify(wsMessage));
      await updateChatObject((pre: ChatObject) => {
        pre.record = [...pre.record, message];
      });
    } else {
      let message = {
        direction: 1,
        source: userInfo?.id,
        target: chatObject.userid,
        time: "",
        content,
        sourceName: userInfo?.nickName,
      };
      let wsMessage = {
        type: 2,
        userId: userInfo?.id,
        toUserId: -1,
        toGroupId: groupObject.groupid,
        content,
      };
      ws?.send(JSON.stringify(wsMessage));
      await updateGroupObject((pre: GroupObject) => {
        pre.record = [...pre.record, message];
      });
    }
    scrollBottom("chat-content");
  };

  // 控制滚动条位置
  const controlScroll = (
    isScroll: boolean,
    dom: any,
    scrollTop: number,
    scrollHeight: number
  ) => {
    if (!isScroll) {
      scrollBottom("chat-content");
    } else {
      dom.scrollTop = scrollTop + dom.scrollHeight - scrollHeight;
    }
  };

  const openChatBox = (targetId: number, type: string, isScroll: boolean) => {
    let dom = document.querySelector(".chat-content"); // 滚动条在Y轴滚动过的高度
    let scrollTop = 0;
    let scrollHeight = 0;
    if (dom) {
      // 保存增加聊天记录之前的高度
      scrollTop = dom.scrollTop; // 滚动条在Y轴滚动过的高度
      scrollHeight = dom.scrollHeight; // 滚动条的高度
    }
    // 如果是切换，则重置页数
    if (isScroll === false) {
      pageNum = 0;
    }
    if (type === "friend") {
      const param = {
        userId: userInfo?.id,
        targetId,
        pageNum: pageNum,
        pageSize: 10,
      };
      // 若为好友，获取对应用户的记录信息
      MainReq.getFriendRecord(param)
        .then(async (res) => {
          const { data } = res;
          const { detailVoList } = data;
          // 更新ChatObject
          await updateChatObject((pre: ChatObject) => {
            let obj: FriendListItem | undefined = friendList.find(
              (n) => n.friendId === targetId
            );
            if (!obj) return pre;
            pre.avatar = obj.avatar;
            pre.nickName = obj.friendName;
            pre.record = isScroll
              ? [...detailVoList, ...pre.record]
              : detailVoList;
            pre.userid = obj.friendId;
          });
          if (detailVoList.length !== 0) {
            pageNum++;
            // 调整滚动条高度，防止页面闪烁
            controlScroll(isScroll, dom, scrollTop, scrollHeight);
          }
          // 设置所选的列表项 id
          setFriendItemId(targetId);
          return;
        })
        .catch((err) => {
          throw err;
        });
    } else {
      const param = {
        userId: userInfo?.id,
        groupId: targetId,
        pageNum: pageNum,
        pageSize: 10,
      };
      // 若为群聊，获取群聊的记录信息
      MainReq.getGroupRecord(param)
        .then(async (res) => {
          const { data } = res;
          const { detailVoList } = data;
          await updateGroupObject((pre: GroupObject) => {
            let obj: Group | undefined = groupList.find(
              (n) => n.id === targetId
            );
            if (!obj) return pre;
            pre.groupid = targetId;
            pre.groupName = groupList.find((v) => v.id === targetId)?.groupName;
            pre.record = isScroll
              ? [...detailVoList, ...groupObject.record]
              : detailVoList;
          });
          if (detailVoList.length !== 0) {
            pageNum++;
            controlScroll(isScroll, dom, scrollTop, scrollHeight);
          }
          setGroupItemId(targetId);
          return;
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  // 获取列表
  const getFriendList = () => {
    // @ts-ignore
    MainReq.getFriendList(userInfo?.id)
      .then(async (res) => {
        const { data } = res;
        await updateFriendList(data);
      })
      .catch((err) => {
        throw err;
      });
  };

  const getGroupList = () => {
    // @ts-ignore
    MainReq.getGroupList(userInfo?.id)
      .then(async (res) => {
        const { data } = res;
        await updateGroupList(data);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    if (!checkIsLogin("chatUserInfo")) {
      Message.warning("登录过期，请重新登录！");
    } else {
      setIsLogin(true);
      if (!ws) {
        createWebSocket(wsUrl);
      }
    }
    return () => {
      closeSocket();
    };
  }, []);

  useEffect(() => {
    if (isLogin) {
      if (!userInfo?.id) {
        setTimeout(() => {
          Message.warning("用户信息缺失，请重新登录！");
        }, 1000);
        return;
      }
      getFriendList();
      getGroupList();
    }
  }, [isLogin]);

  useEffect(() => {
    setNoticeTypeChange(nanoid());
  }, [isLogin, chatObject, groupObject]);

  const addFriend = () => {
    showModal();
  };

  const switchList = (type: string) => {
    setListType(type);
  };

  const notice = (type: string) => {
    if (type === "add") {
      getFriendList();
    }
  };

  const getRecord = () => {
    if (listType === "friend") {
      updateChatObject((pre: ChatObject) => {
        openChatBox(pre.userid, listType, true);
      });
    } else {
      updateGroupObject((pre: GroupObject) => {
        openChatBox(pre.groupid, listType, true);
      });
    }
  };

  useEffect(() => {
    setBind((v) => v + 1);
  }, [listType, friendList, groupObject]);

  return isLogin ? (
    <>
      <MyModal
        notice={notice}
        type={modalType}
        showModal={showModal}
        handleOk={handleOk}
        handleCancel={handleCancel}
        visible={isModalVisible}
      ></MyModal>
      <div className="friend-ct">
        <div className="friend-header">
          <div className="chat-switch-ct">
            <div
              className={`switch${listType === "friend" ? " active" : ""}`}
              onClick={() => switchList("friend")}
            >
              好友
            </div>
            <div
              className={`switch${listType !== "friend" ? " active" : ""}`}
              onClick={() => switchList("group")}
            >
              群聊
            </div>
          </div>
          <div className="add" onClick={addFriend}>
            +
          </div>
        </div>
        <div className="friend-list">
          {listType === "friend"
            ? friendList?.map((v) => (
                <FriendItem
                  active={friendItemId === v.friendId ? true : false}
                  openChatBox={openChatBox}
                  className="friend-item"
                  type="friend"
                  key={nanoid()}
                  data={v}
                />
              ))
            : groupList?.map((v) => (
                <FriendItem
                  active={groupItemId === v.id ? true : false}
                  openChatBox={openChatBox}
                  className="group-item"
                  type="group"
                  key={nanoid()}
                  data={v}
                />
              ))}
        </div>
      </div>
      <div
        className="chat-ct"
        style={{
          display:
            (listType === "friend" && chatObject.userid === -1) ||
            (listType === "group" && groupObject.groupid === -1)
              ? "none"
              : "flex",
        }}
      >
        <div className="chat-header">
          {listType === "friend" ? chatObject.nickName : groupObject.groupName}
        </div>
        <ChatObjectContext.Provider value={{ chatObject, updateChatObject }}>
          <ChatContent
            bind={bind}
            getRecord={getRecord}
            className="chat-content"
            object={listType === "friend" ? chatObject : groupObject}
          />
        </ChatObjectContext.Provider>
        <ChatEdit
          noticeTypeChange={noticeTypeChange}
          className="chat-edit"
          send={send}
        />
      </div>
    </>
  ) : (
    <></>
  );
}
