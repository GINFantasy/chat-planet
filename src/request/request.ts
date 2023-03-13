/*
 * @Description: axios封装
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 09:55:03
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2023-03-06 20:20:47
 */
import axios from "axios";
import store from "../Store";
import { checkIsLogin, Message } from "../utils/index";
const DOMAIN = import.meta.env.VITE_BASE_API; // 接口根路径
const Request = axios.create({
  baseURL: DOMAIN,
});

export const wsUrlDomain = `ws${DOMAIN.split("http")[1]}websocket/`;
// axios拦截器
Request.interceptors.request.use(
  (config: any) => {
    const chatUserInfo = store.getItem("chatUserInfo");
    let token = "";
    if (chatUserInfo) {
      token = chatUserInfo.token;
    }
    let flag = config.url.indexOf("login") === -1;
    config.headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    //设置请求头
    if (flag) {
      config.headers["chatToken"] = token; //登录不用token
    }
    return config;
  },
  (error: any) => {
    Message.error("请求超时!");
    return Promise.resolve(error);
  }
);

Request.interceptors.response.use(
  (res: any) => {
    if (!res) {
      Message.error("数据获取异常！");
      return Promise.reject(null);
    }
    const { data } = res;
    if (data.code === 401) {
      Message.error("身份过期，请重新登录!");
      store.remove("chatUserInfo");
      setTimeout(() => {
        checkIsLogin("chatUserInfo");
      }, 2000);
    }
    return Promise.resolve(data);
  },
  (err: any) => {
    console.log(err);

    if (err.response.status === 504 || err.response.status === 404) {
      Message.error("服务器出现问题！");
    } else if (err.response.status === 401) {
      Message.error("请先登录!");
      store.remove("chatUserInfo");
    } else if (err.response.status === 403) {
      Message.error("权限不足,请联系管理员!");
    } else if (err.response.status === 0) {
      Message.error("服务器未启动！");
    } else {
      Message.error("未知错误！");
    }
    return Promise.reject(err);
  }
);

export default Request;
