/*
 * @Description:监控SDK
 * @Autor: GuluGuluu
 * @Date: 2023-03-07 11:54:40
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2023-03-08 18:57:33
 */

interface MonitorOptions {
  // 目标服务器地址
  url: string;
  // 标识
  name: string;
}

class Monitor {
  url: string | null = null;
  name: string | null = null;

  constructor(options: MonitorOptions) {
    const { url, name } = options;
    this.url = url;
    this.name = name;
  }

  // 用try-catch包装函数
  static wrapErrors(fn: any) {
    // don't wrap function more than once
    if (!fn.__wrapped__) {
      fn.__wrapped__ = function () {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          throw e; // re-throw the error
        }
      };
    }

    return fn.__wrapped__;
  }

  // 监听异常
  listenError() {
    // 包装监听器，用try-catch统一抛出错误
    const originAddEventListenr = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (
      type,
      listener: any,
      options
    ) {
      const wrappedListener = (...args: any[]) => {
        try {
          return listener.apply(this, args);
        } catch (err) {
          throw err;
        }
      };
      return originAddEventListenr.call(this, type, wrappedListener, options);
    };
    // 一般异常监听
    window.addEventListener(
      "error",
      (error) => {
        console.log("捕获到一般异常：", error);
      },
      true
    );

    // 异步异常监听
    window.addEventListener("unhandledrejection", function (e) {
      if (typeof e.reason === "object") {
        console.log("未处理的 unhandledrejection 事件", e.reason);
      } else {
        // 上报
        console.log("上报一下");
      }
    });
  }
}

export default Monitor;
