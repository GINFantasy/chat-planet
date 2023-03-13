import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { API } from '../request/api'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Message } from '../utils'
const style = { 
    height: 'calc(100% - 40px)',
    overflowY: 'auto' 
}
const DOMAIN = import.meta.env.VITE_BASE_API
function ChatEdit(props:{className:string,send:Function,noticeTypeChange:any}) {
    const [editor, setEditor] = useState<IDomEditor | null>(null) // 存储 editor 实例
    const [html, setHtml] = useState('') // 编辑器内容
    const {className,send,noticeTypeChange} = props

    const toolbarConfig: Partial<IToolbarConfig> = {
        excludeKeys: [
            'headerSelect',
            'italic',
            "blockquote",
            "bold",
            "bgColor",
            "color",
            "fontSize",
            "underline",
            "group-justify",
            "group-indent",
            "fontFamily",
            "lineHeight",
            "bulletedList",
            "numberedList",
            "todo",
            "group-video",
            "insertLink",
            "insertTable",
            "codeBlock",
            "divider",
            "undo",
            "redo",
            'group-more-style' // 排除菜单组，写菜单组 key 的值即可
        ]
    }
    const editorConfig: Partial<IEditorConfig> = {
        MENU_CONF:{
            'uploadImage':{
                // 接口地址
                server: `${DOMAIN}${API.uploadImg}`,

                fieldName:'img',

                base64LimitSize: 1024, // 0.5mb

                // 单个文件的最大体积限制，默认为 2M
                maxFileSize: 5 * 1024 * 1024, // 5M

                // 最多可上传几个文件，默认为 100
                maxNumberOfFiles: 10,

                // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
                allowedFileTypes: [],
                // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
                // meta: {
                //     token: 'xxx',
                //     otherKey: 'yyy'
                // },

                // 将 meta 拼接到 url 参数中，默认 false
                metaWithUrl: false,

                // 超时时间，默认为 10 秒
                timeout: 5 * 1000, // 5 秒

                onSuccess(file: File, res: any) {
                    const {data} = res;
                    console.log(data.url);
                },
                // 单个文件上传失败
                onFailed(file: File, res: any) {
                    Message.error(res.msg);
                },
                // 上传错误，或者触发 timeout 超时
                onError(file: File, err: any, res: any) {
                    Message.error('上传失败，发送未知错误！');
                },
            }
        }
    }

    const editCallback = (e:any)=>{
        const {code,shiftKey,key} = e;
        if(code === 'Enter' && !shiftKey && key === 'Enter'){
            // 阻止再插入换行
            e.preventDefault();
            if(editor){
                send(editor?.getHtml());  // 发送编辑器内容
                editor.clear();     // 发送后清空编辑器内容
            }
        }
    }
    // 发送按钮回调
    const handleSend = ()=>{
        if(editor){
            send(editor?.getHtml());
            editor.clear();
        }
    }

    const bindKeyEvent = (className:string,callback:Function)=>{
        let dom:any =document.querySelector(`.${className}`);
        if(dom){
            dom.onkeydown = callback
        }
    }

    const removeKeyEvent = (className:string) =>{
        let dom:any =document.querySelector(`.${className}`);
        if(dom){
            dom.onkeydown = null;
        }
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        if(editor){
            bindKeyEvent('w-e-scroll div:nth-child(1)',editCallback);
        }
        return () => {
            removeKeyEvent('w-e-scroll div:nth-child(1)');
            if (editor == null) return
            editor.destroy()
            setEditor(null);
        }
    }, [editor])
    
    useEffect(()=>{
        removeKeyEvent('w-e-scroll div:nth-child(1)');
        bindKeyEvent('w-e-scroll div:nth-child(1)',editCallback);
    },[noticeTypeChange])

    return (
        <div className={`${className}-ct`}>
            <div className={className} style={{ zIndex: 100}}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '2px solid #fff',height:'40px' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    mode="default"
                    // @ts-ignore
                    style={style}
                />
            </div>
            <div className="chat-footer">
                <div className="send-btn" onClick={handleSend}>发送</div>
            </div>
        </div>
    )
}

export default ChatEdit