import React, { Component } from "react";

import axios from "axios";

import { Spin, PageHeader, Menu, Avatar, Divider, Input } from "antd";
import { UserOutlined, LogoutOutlined, LockOutlined } from "@ant-design/icons";
// const styles = (theme) => ({
// 	paper: {
// 		marginTop: theme.spacing(8),
// 		diaplay: "flex",
// 		flexDirection: "column",
// 		alignItems: "center",
// 	},
// 	avatar: {
// 		margin: theme.spacing(1),
// 		backgroundColor: theme.palette.secondary.main,
// 	},
// 	form: {
// 		width: "100%",
// 		marginTop: theme.spacing(1),
// 	},
// 	submit: {
// 		margin: theme.spacing(3, 0, 2),
// 	},
// 	customError: {
// 		color: "red",
// 		fontSize: "0.875rem",
// 		marginTop: 10,
// 	},
// 	progress: {
// 		position: "absolute",
// 	},
// });

class login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			errors: [],
			loading: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.UI.errors) {
			this.setState({ errors: nextProps.UI.errors });
		}
	}

	handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		const userData = {
			email: this.state.email,
			password: this.state.password,
		};
		axios
			.post("/login", userData)
			.then((res) => {
				localStorage.setItem("AuthToken", `Bearer ${res.data.token}`);
				this.setState({ loading: false });
				this.props.history.push("/");
			})
			.catch((err) => {
				this.setState({ errors: err.response.data, loading: false });
			});
	};

	render() {
		const { classes } = this.props;
		const { errors, loading } = this.state;
		return (
			<div>
				<div>
					<Avatar size={64} icon={<LockOutlined />} />
					<form noValidate>
						<Input />
					</form>
				</div>
			</div>
		);
	}
}

export default login;
