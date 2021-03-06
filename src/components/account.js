import React, { Component } from "react";
import clsx from "clsx";
import axios from "axios";
import { authMiddleWare } from "../util/auth";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
	Card,
	CardActions,
	CardContent,
	Divider,
	Button,
	Grid,
	TextField,
} from "@material-ui/core";

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	toolbar: theme.mixins.toolbar,
	root: {},
	details: {
		display: "flex",
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
	},
	locationText: {
		paddingLeft: "15px",
	},
	buttonProperty: {
		position: "absolute",
		top: "50%",
	},
	uiProgess: {
		position: "fixed",
		zIndex: "1000",
		height: "31px",
		width: "31px",
		left: "50%",
		top: "35%",
	},
	progess: {
		position: "absolute",
	},
	uploadButton: {
		marginLeft: "8px",
		margin: theme.spacing(1),
	},
	customError: {
		color: "red",
		fontSize: "0.8rem",
		marginTop: 10,
	},
	submitButton: {
		marginTop: "10px",
	},
});

class account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: "",
			lastName: "",
			email: "",
			username: "",
			profilePicture: "",
			uiLoading: true,
			buttonLoading: false,
			imageError: "",
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
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};
	handleImageChange = (e) => this.setState({ image: e.target.files[0] });
	profilePictureHandler = (e) => {
		e.preventDefault();
		this.setState({ uiLoading: true });
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem("AuthToken");
		let form_data = new FormData();
		form_data.append("image", this.state.image);
		form_data.append("content", this.state.content);
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.post("/user/image", form_data, {
				headers: { "content-type": "multipart/form-data" },
			})
			.then(() => window.location.reload())
			.catch((err) => {
				if (err.response.status.code === 403) {
					this.props.history.push("/login");
				}
				console.log(err);
				this.setState({
					uiLoading: false,
					imageError: "Image upload failed!",
				});
			});
	};
	updateFormValues = (e) => {
		e.preventDefault();
		this.setState({ buttonLoading: true });
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem("AuthToken");
		axios.defaults.headers.common = { Authorization: authToken };
		const formRequest = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
		};
		axios
			.post("/user", formRequest)
			.then(() => this.setState({ buttonLoading: false }))
			.catch((err) => {
				if (err.response.status === 403) {
					this.props.history.push("/login");
				}
				console.log(err);
				this.setState({ buttonLoading: false });
			});
	};
	render() {
		const { classes, ...rest } = this.props;
		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && (
						<CircularProgress size={150} className={classes.uiProgess} />
					)}
				</main>
			);
		} else {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Card {...rest} className={clsx(classes.root, classes)}>
						<CardContent>
							<div className={classes.details}>
								<div>
									<Typography
										className={classes.locationText}
										gutterBottom
										variant="h4"
									>
										{this.state.firstName} {this.state.lastName}
									</Typography>
									<Button
										variant="outlined"
										color="primary"
										type="submit"
										size="small"
										startIcon={<CloudUploadIcon />}
										className={classes.uploadButton}
										onClick={this.profilePictureHandler}
									>
										Upload Photo
									</Button>
									<input
										type="file"
										onChange={this.handleImageChange}
									/>

									{this.state.imageError ? (
										<div className={classes.customError}>
											{" "}
											Wrong Image Format || Supported Format are PNG
											and JPG
										</div>
									) : (
										false
									)}
								</div>
							</div>
							<div className={classes.progress} />
						</CardContent>
						<Divider />
					</Card>

					<br />
					<Card {...rest} className={clsx(classes.root, classes)}>
						<form autoComplete="off" noValidate>
							<Divider />
							<CardContent>
								<Grid container spacing={3}>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="First name"
											margin="dense"
											name="firstName"
											variant="outlined"
											value={this.state.firstName}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="Last name"
											margin="dense"
											name="lastName"
											variant="outlined"
											value={this.state.lastName}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="Email"
											margin="dense"
											name="email"
											variant="outlined"
											disabled={true}
											value={this.state.email}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="Phone Number"
											margin="dense"
											name="phone"
											type="number"
											variant="outlined"
											disabled={true}
											value={this.state.phoneNumber}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="User Name"
											margin="dense"
											name="userHandle"
											disabled={true}
											variant="outlined"
											value={this.state.username}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											label="Country"
											margin="dense"
											name="country"
											variant="outlined"
											value={this.state.country}
											onChange={this.handleChange}
										/>
									</Grid>
								</Grid>
							</CardContent>
							<Divider />
							<CardActions />
						</form>
					</Card>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						className={classes.submitButton}
						onClick={this.updateFormValues}
						disabled={
							this.state.buttonLoading ||
							!this.state.firstName ||
							!this.state.lastName ||
							!this.state.country
						}
					>
						Save details
						{this.state.buttonLoading && (
							<CircularProgress size={30} className={classes.progess} />
						)}
					</Button>
				</main>
			);
		}
	}
}

export default withStyles(styles)(account);
