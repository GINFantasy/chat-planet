/*
 * @Description: navlink封装
 * @Version: 2.0
 * @Autor: GuluGuluu
 * @Date: 2022-05-27 15:45:50
 * @LastEditors: GuluGuluu
 * @LastEditTime: 2022-05-28 15:29:34
 */
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom'

interface NavLinkProps {
	className:string,
	active:string,
	path:string,
	value?:string,
	title:string,
	children?:ReactElement
}
function MyNavLink(props:NavLinkProps) {
	// 分别是类名，active类名，路径和文字
	const {className,active,path,value,title,children} = props;
	return (
		<NavLink  className={({ isActive }) => className + (isActive ? ` ${active}` : "")} title={title} to={path}>
			{children}
			{value}
		</NavLink>
	)
}
export default MyNavLink;