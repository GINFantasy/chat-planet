/*
 * @Description: 本地存储
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-08-10 12:41:45
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-08-10 13:15:07
 */
// key值始终固定
const store:any = {
    getItem(key:string) {
        const str = window.localStorage.getItem(key);
        if(str === null) return null
        const obj = JSON.parse(str)
        return obj;
    },
    setItem(key:string,data:any) {
        window.localStorage.setItem(key, JSON.stringify(data));
    },
    remove(key:string) {
        window.localStorage.removeItem(key)
    },
}

export default store
