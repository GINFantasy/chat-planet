/*
 * @Description: 消息气泡
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 19:38:08
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-06-27 11:49:16
 */
import React, { useContext, useRef } from "react";
import { ChatRecord } from "../custom_types/Log"
import { Image } from "antd";
import htmr from "htmr";
import { nanoid } from "nanoid";
import { Fragment } from "react";
export default function Bubble(props:{data:ChatRecord,avatar:string,myavatar:string}){
    const {avatar,myavatar} = props
    const {content,direction,sourceName} = props.data;
    let imgsrc = useRef('')
    const transform = {
        // 参数跟React.createElement一致
        // @ts-ignore 
        _: (nodeName, props, children) => {
            // 修改img标签为Image组件 
            if(nodeName === 'img') {
                imgsrc.current = props.src;
                return <Image key={nanoid()} src={imgsrc.current}/>
            }else if (typeof props === "undefined") {
                // 其他则按原样进行解析
                return <Fragment key={nanoid()}>{ nodeName }</Fragment>;
            }
            return React.createElement(nodeName, props, children);
        }
    }
    
    // 调用htmr库将html代码转为jsx元素
    const transformContent = htmr(content, {transform});
    return <div className={`bubble-ct${direction?" bubble-send":" bubble-recieve"}`}>
        <div className="bubble">
            <div className="content-ct">
                <span className="bubble-name">{sourceName}</span>
                <span className="bubble-content" >{transformContent}</span>
            </div>
            {
                direction
                ?<span className="bubble-avatar" style={{backgroundImage:`url(${myavatar})`}}></span>
                :<span className="bubble-avatar" style={{backgroundImage:`url(${avatar?avatar:''})`}}></span>
            }
            
        </div>
    </div>
}