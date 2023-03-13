/*
 * @Description: main
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-23 09:49:37
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-07-02 09:00:50
 */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {HashRouter} from 'react-router-dom'

ReactDOM.render(
    <HashRouter>
      <App/>
   </HashRouter>,
  document.getElementById('root')
)
