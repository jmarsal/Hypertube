import React from 'react';
import { Alert, Image, Col, FormControl, FormGroup, Form, ControlLabel, ButtonToolbar, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'validator';
import path from 'path';

import { addUser, resetButton, selectBasicAvatar } from '../../actions/usersActions';
import { uploadDocumentRequest } from '../../actions/uploadActions';

class SubscribeForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sendOn: false,
			sizeError: '',
			username: '',
			email: '',
			password: '',
			img: '',
			imgObj: {},
			newImagename: '',
			firstname: '',
			lastname: '',
			emailCheck: 'warning',
			usernameCheck: 'warning',
			passwordCheck: 'warning',
			imgCheck: 'warning',
			firstnameCheck: 'warning',
			lastnameCheck: 'warning'
		};
	}

	handleChange(e) {
		const { selectBasicAvatar } = this.props;
		const inputId = e.target.id,
			val = e.target.value;

		if (inputId === 'username') {
			if (val.length > 0 && val.length < 31) {
				this.setState({ usernameCheck: 'success' });
			} else {
				this.setState({ usernameCheck: 'warning' });
			}
			this.setState({ username: val });
		}
		if (inputId === 'firstname') {
			if (val.length > 0 && val.length < 50) {
				this.setState({ firstnameCheck: 'success' });
			} else {
				this.setState({ firstnameCheck: 'warning' });
			}
			this.setState({ firstname: val });
		}
		if (inputId === 'lastname') {
			if (val.length > 0 && val.length < 50) {
				this.setState({ lastnameCheck: 'success' });
			} else {
				this.setState({ lastnameCheck: 'warning' });
			}
			this.setState({ lastname: val });
		}
		if (inputId === 'email') {
			if (validator.isEmail(val)) {
				this.setState({ email: val, emailCheck: 'success' });
			} else {
				this.setState({ emailCheck: 'warning' });
			}
		}
		if (inputId === 'password') {
			this.setState({ password: val });
			if (val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')) {
				this.setState({ passwordCheck: 'success' });
			} else {
				this.setState({ passwordCheck: 'warning' });
			}
		}
		if (inputId === 'avatar') {
			if (validator.matches(val, /.(gif|jpg|jpeg|png)$/, 'i') && e.target.files[0]) {
				if (e.target.files[0].size > 5000000) {
					this.setState({ sizeError: 'Avatar: File too big.', imgCheck: 'error' });
				} else if (e.target.files[0].size < 100) {
					this.setState({ sizeError: 'Avatar: File too small.', imgCheck: 'error' });
				} else {
					this.setState({
						newImagename: '_' + Date.now() + '_profil' + path.extname(e.target.files[0].name)
					});
					this.setState({ imgObj: e.target.files[0], imgCheck: 'success', img: val });
					selectBasicAvatar('none');
				}
			} else {
				this.setState({ sizeError: 'Avatar: Files accepted are .gif, .jpg, .jpeg, .png.', imgCheck: 'error' });
			}
		} else {
			this.setState.img = '';
		}
	}

	selectAvatar(avatar) {
		const { selectBasicAvatar } = this.props;

		selectBasicAvatar(avatar);
		this.setState({ img: avatar, imgCheck: 'success' });
	}

	submitForm() {
		const user = {
				username: this.state.username,
				email: this.state.email,
				password: this.state.password,
				img: this.state.img,
				firstname: this.state.firstname,
				lastname: this.state.lastname
			},
			file = this.state.imgObj;
		if (this.state.img.search('/avatars/') > 0) {
			this.props.uploadDocumentRequest({
				file,
				name: this.state.newImagename
			});
		}

		this.props.addUser(user);
	}

	componentDidUpdate() {
		const { messSuccess } = this.props;

		if (
			this.state.sendOn == false &&
			this.state.usernameCheck === 'success' &&
			this.state.emailCheck === 'success' &&
			this.state.passwordCheck === 'success' &&
			this.state.imgCheck === 'success' &&
			this.state.firstnameCheck === 'success' &&
			this.state.lastnameCheck === 'success'
		) {
			this.setState({ sendOn: true });
		} else if (
			this.state.sendOn == true &&
			(this.state.usernameCheck !== 'success' ||
				this.state.emailCheck !== 'success' ||
				this.state.passwordCheck !== 'success' ||
				this.state.imgCheck !== 'success' ||
				this.state.firstnameCheck !== 'success' ||
				this.state.lastnameCheck !== 'success')
		) {
			this.setState({ sendOn: false });
		}

		if (messSuccess) {
			setTimeout(function() {
				window.location.href = '/';
			}, 1000);
		}
	}

	render() {
		const { showModal, messSuccess } = this.props;
		console.log(this.props);

		return (
			<Form horizontal>
				<FormGroup>
					<Col sm={10}>
						{this.props.errorsUsers
							? this.props.errorsUsers.map((errorsArr, i) => {
									return (
										<Alert key={i} bsStyle="warning">
											{errorsArr.msg}
										</Alert>
									);
								})
							: ''}
						{this.props.errorsUpload
							? this.props.errorsUpload.map((errorsArr, i) => {
									return (
										<Alert key={i} bsStyle="warning">
											{errorsArr.msg}
										</Alert>
									);
								})
							: ''}
						{this.state.sizeError
							? <Alert key="sizeError" bsStyle="warning">
									{this.state.sizeError}
								</Alert>
							: ''}
						{messSuccess
							? <Alert bsStyle="success">
									{messSuccess + this.state.username + '!'}
								</Alert>
							: ''}
					</Col>
				</FormGroup>
				<FormGroup controlId="username" validationState={this.state.usernameCheck}>
					<Col componentClass={ControlLabel} sm={2}>
						Login
					</Col>
					<Col sm={10}>
						<FormControl
							type="text"
							placeholder="Enter your login"
							ref="username"
							autoFocus="true"
							value={this.state.username}
							onChange={(e) => this.handleChange(e)}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="firstname" validationState={this.state.firstnameCheck}>
					<Col componentClass={ControlLabel} sm={2}>
						Firstname
					</Col>
					<Col sm={10}>
						<FormControl
							type="text"
							placeholder="Enter your firstname"
							ref="firstname"
							value={this.state.firstname}
							onChange={(e) => this.handleChange(e)}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="lastname" validationState={this.state.lastnameCheck}>
					<Col componentClass={ControlLabel} sm={2}>
						Lastname
					</Col>
					<Col sm={10}>
						<FormControl
							type="text"
							placeholder="Enter your lastname"
							ref="lastname"
							value={this.state.lastname}
							onChange={(e) => this.handleChange(e)}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="email" validationState={this.state.emailCheck}>
					<Col componentClass={ControlLabel} sm={2}>
						Email
					</Col>
					<Col sm={10}>
						<FormControl
							type="email"
							placeholder="Enter your email"
							ref="email"
							onChange={(e) => this.handleChange(e)}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="password" validationState={this.state.passwordCheck}>
					<Col componentClass={ControlLabel} sm={2}>
						Password
					</Col>
					<Col sm={10}>
						<FormControl
							type="password"
							placeholder="Enter your password"
							ref="password"
							onChange={(e) => this.handleChange(e)}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="avatar" validationState={this.state.imgCheck}>
					<Col componentClass={ControlLabel} sm={2}>
						Avatar
					</Col>
					<Col sm={10}>
						<h5>Upload your image...</h5>
						<FormControl type="file" onChange={(e) => this.handleChange(e)} />
					</Col>
					<Col sm={10}>
						<Col smOffset={2} sm={10}>
							<h5>Or choose avatar here...</h5>
						</Col>
						<Col smOffset={2} sm={12}>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'croupier'
											? 'logoOauth croupier active'
											: 'logoOauth croupier'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/croupier.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'diver'
											? 'logoOauth diver active'
											: 'logoOauth diver'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/diver.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'doctor'
											? 'logoOauth doctor active'
											: 'logoOauth doctor'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/doctor.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'doctor2'
											? 'logoOauth doctor2 active'
											: 'logoOauth doctor2'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/doctor2.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'farmer'
											? 'logoOauth farmer active'
											: 'logoOauth farmer'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/farmer.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'firefighter'
											? 'logoOauth firefighter active'
											: 'logoOauth firefighter'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/firefighter.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'man'
											? 'logoOauth man active'
											: 'logoOauth man'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/man.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'nun'
											? 'logoOauth nun active'
											: 'logoOauth nun'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/nun.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'showman'
											? 'logoOauth showman active'
											: 'logoOauth showman'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/showman.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'stewardess'
											? 'logoOauth stewardess active'
											: 'logoOauth stewardess'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/stewardess.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'welder'
											? 'logoOauth welder active'
											: 'logoOauth welder'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/welder.png')}
								/>
							</Col>
							<Col xs={3}>
								<div
									className={
										this.props.classActive && this.props.classActive === 'woman'
											? 'logoOauth woman active'
											: 'logoOauth woman'
									}
									onClick={(avatar) => this.selectAvatar('/avatars/woman.png')}
								/>
							</Col>
						</Col>
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={10}>
						<ButtonToolbar>
							<Button type="button" onClick={() => showModal(false)}>
								Close
							</Button>
							{messSuccess
								? ''
								: <Button
										bsStyle="primary"
										type="button"
										disabled={!this.state.sendOn}
										onClick={() => this.submitForm()}
									>
										Sign in
									</Button>}
						</ButtonToolbar>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}

function mapStateToProps(state) {
	return {
		users: state.users.users,
		upload: state.upload,
		msg: state.users.msg,
		style: state.users.style,
		validation: state.users.validation,
		errorsUsers: state.users.errors,
		errorsUpload: state.upload.errors,
		messSuccess: state.users.messSuccess,
		classActive: state.users.classActive
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			addUser,
			uploadDocumentRequest,
			resetButton,
			selectBasicAvatar
		},
		dispatch
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeForm);
