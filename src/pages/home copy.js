import React, { Component } from "react";
import axios from "axios";

import Account from "../components/account";
import Todo from "../components/todo";

import { authMiddleWare } from "../util/auth";

import { Spin, PageHeader, Menu, Avatar, Divider } from "antd";
import {
	UserOutlined,
	UnorderedListOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import "./home.css";

const drawerWidth = 240;

// const styles = (theme) => ({
// 	root: {
// 		display: "flex",
// 	},
// 	appBar: {
// 		zIndex: theme.zIndex.drawer + 1,
// 	},
// 	drawer: {
// 		width: drawerWidth,
// 		flexShrink: 0,
// 	},
// 	drawerPaper: {
// 		width: drawerWidth,
// 	},
// 	content: {
// 		flexGrow: 1,
// 		padding: theme.spacing(3),
// 	},
// 	avatar: {
// 		height: 110,
// 		width: 100,
// 		flexShrink: 0,
// 		flexGrow: 0,
// 		marginTop: 20,
// 	},
// 	uiProgess: {
// 		position: "fixed",
// 		zIndex: "1000",
// 		height: "31px",
// 		width: "31px",
// 		left: "50%",
// 		top: "35%",
// 	},
// 	toolbar: theme.mixins.toolbar,
// });
class home extends Component {
	state = { render: false };
	loadAccountPage = (e) => this.setState({ render: true });
	loadTodoPage = (e) => this.setState({ render: true });
	logoutHandler = (e) => {
		localStorage.removeItem("AuthToken");
		this.props.history.push("/login");
	};
	constructor(props) {
		super(props);
		this.state = {
			firstsName: "",
			lastName: "",
			profilePicture: "",
			uiLoading: true,
			imageLoading: false,
		};
	}

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem("AuthToken");
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get("/user")
			.then((res) => {
				console.log(res.data);
				this.setState({
					firstName: res.data.userCredentials.firstName,
					lastName: res.data.userCredentials.lastName,
					email: res.data.userCredentials.email,
					username: res.data.userCredentials.username,
					profilePicture: res.data.userCredentials.imageUrl,
					uiLoading: false,
				});
			})
			.catch((err) => {
				if (err.response.status === 403) {
					this.props.history.push("/login");
				}
				console.log(err);
				this.setState({ errorMsg: "Error in retrieving the data!" });
			});
	};

	render() {
		const { classes } = this.props;
		if (this.state.uiLoading === true) {
			return <div className="root">{this.state.uiLoading && <Spin />}</div>;
		} else {
			return (
				<div>
					<PageHeader
						className="site-page-header"
						backIcon={false}
						title="TodoApp"
						subTitle=""
					/>
					<div className="root">
						<Menu
							onClick={this.handleClick}
							style={{ width: 240 }}
							defaultSelectedKeys={["1"]}
							defaultOpenKeys={["sub1"]}
							mode="inline"
						>
							<Divider />
							<center>
								<Avatar size={64} icon={<UserOutlined />} />

								<p>
									{" "}
									{this.state.firstName} {this.state.lastName}
								</p>
							</center>
							<Divider />

							<Menu.Item key="1" icon={<UnorderedListOutlined />}>
								Todo
							</Menu.Item>
							<Menu.Item key="2" icon={<UserOutlined />}>
								Account
							</Menu.Item>
							<Menu.Item key="3" icon={<LogoutOutlined />}>
								Logout
							</Menu.Item>
						</Menu>
						<div>{this.state.render ? <Account /> : <Todo />}</div>
					</div>
				</div>
			);
		}
	}
}

export default home;
