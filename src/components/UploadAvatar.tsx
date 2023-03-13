/*
 * @Description: 
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-27 15:22:31
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 14:42:19
 */
import React, { useEffect, useState } from 'react';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Message } from '../utils';
import { API } from '../request/api'
import { User } from '../custom_types/Log';
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    Message.error('只能上传 JPG/PNG 文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    Message.error('图片必须在 2MB 以内!');
  }
  return isJpgOrPng && isLt2M;
};

const UploadAvatar = (props:{id:number | undefined,setUser:Function}) => {
  const {id,setUser} = props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false);
        setImageUrl(url);
      });
      const {response}  = info.file
      if(response.code === 200){
        setUser((v:User)=>{
          const {userInfo,token} = v;
          return {
            token,
            userInfo:{
              id:userInfo.id,
              avatar:response.data,
              name:userInfo.name
            }
          }
        })
        Message.success('更换成功！');
      }else{
        Message.error(response.msg);
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="img"
      data={
        {
          userId:id
        }
      }
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={API.uploadAvatar}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default UploadAvatar;