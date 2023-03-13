/*
 * @Description: 工具类函数
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 09:56:13
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2023-03-10 19:52:34
 */
import { message } from "antd";
import { useEffect } from "react";
import { User } from "../custom_types/Log";
import store from "../Store";
export const Message = {
  config: {
    duration: 1.5,
  },
  success: function (content: string) {
    message.success({ ...this.config, content });
  },
  error: function (content: string) {
    message.error({ ...this.config, content });
  },
  warning: function (content: string) {
    message.warning({ ...this.config, content });
  },
  loading: function (content: string) {
    message.loading({ ...this.config, content });
  },
  destroy: function () {
    message.destroy();
  },
};
type Timer = number | null;
// 防抖
export function debounce(fn: Function, delay: number) {
  let timer: Timer = null; // 借助闭包
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay);
  };
}

export function getLineNumber(dom: HTMLElement | null, lineheight: number) {
  if (dom === null) {
    return 3;
  }
  let styles = window.getComputedStyle(dom, null);
  let h = parseInt(styles.height, 10);
  return h / lineheight;
}

export const useMount = (callback: Function) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useUnMount = (callback: Function) => {
  // @ts-ignore
  useEffect(() => {
    return callback;
  }, []);
};

export const scrollBottom = (className: string) => {
  let dom = document.querySelector(`.${className}`);
  if (dom) {
    dom.scrollTop = dom.scrollHeight;
  }
};

export const handleScrollTop = (dom: any, callback: Function) => {
  let scrollTop = dom.scrollTop; //滚动条在Y轴滚动过的高度
  if (scrollTop === 0) {
    callback();
  }
};

export const isEmpty = (value: string) => {
  const getText = (str: string) => {
    return str
      .replace(/<[^<p>]+>/g, "") // 将所有<p> 替换为 ''
      .replace(/<[</p>$]+>/g, "") // </p>
      .replace(/&nbsp;/gi, "") // 空格
      .replace(/<[^<br/>]+>/g, ""); // 换行符
  };
  const isNull = (str: string) => {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  };
  let text = getText(value);
  return isNull(text);
};

export const checkIsLogin = (key: string) => {
  if (store.getItem(key)) {
    return true;
  } else {
    const exit: any = document.querySelector(".exit");
    if (exit) exit.click();
    return false;
  }
};
