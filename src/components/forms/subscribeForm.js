import React from 'react';
import {
	Alert,
	Popover,
	OverlayTrigger,
	MenuItem,
	InputGroup,
	DropdownButton,
	Image,
	Col,
	Row,
	Well,
	Panel,
	FormControl,
	FormGroup,
	ControlLabel,
	ButtonToolbar,
	Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom';
import { addUser, resetButton } from '../../actions/usersActions';
import { uploadDocumentRequest } from '../../actions/uploadActions';
import axios from 'axios';
import path from 'path';

class SubscribeForm extends React.Component {
	handleSubmit() {
		if (!this.fileUpload.files[0]) {
			this.refs.emptyAvatar.show();
		} else {
			let filename =
				findDOMNode(this.refs.username).value +
				'_' +
				Date.now() +
				'_profil' +
				path.extname(this.fileUpload.files[0].name);

			const user = {
				username: findDOMNode(this.refs.username).value,
				email: findDOMNode(this.refs.email).value,
				password: findDOMNode(this.refs.password).value,
				img: filename,
				firstname: findDOMNode(this.refs.firstname).value,
				lastname: findDOMNode(this.refs.lastname).value
			};

			if (user.username === '') {
				this.refs.emptyLogin.show();
			} else if (user.firstname === '') {
				this.refs.emptyFirstname.show();
			} else if (user.lastname === '') {
				this.refs.emptyLastname.show();
			} else if (user.email === '') {
				this.refs.emptyEmail.show();
			} else if (user.password === '') {
				this.refs.emptyPassword.show();
			} else {
				if (this.fileUpload.files[0]) {
					const file = this.fileUpload.files[0];
					this.props.uploadDocumentRequest({
						file,
						name: filename
					});
				}
				this.props.addUser(user);
			}
		}
	}

	resetForm() {
		const { showModal } = this.props;

		showModal(false);
		this.props.resetButton();
		findDOMNode(this.refs.username).value = '';
		findDOMNode(this.refs.email).value = '';
		findDOMNode(this.refs.password).value = '';
		findDOMNode(this.refs.firstname).value = '';
		findDOMNode(this.refs.lastname).value = '';
	}

	render() {
		const { showModal } = this.props;

		return (
			<Row>
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
					<OverlayTrigger
						ref="emptyLogin"
						placement="right"
						overlay={
							<Popover id="popover-positioned-right">
								Please enter your login.
							</Popover>
						}
					>
						<FormGroup controlId="username" validationState={this.props.validation}>
							<ControlLabel>Login</ControlLabel>
							<FormControl type="text" placeholder="Enter your login" ref="username" />
							<FormControl.Feedback />
						</FormGroup>
					</OverlayTrigger>

					<OverlayTrigger
						ref="emptyFirstname"
						placement="right"
						overlay={
							<Popover id="popover-positioned-right">
								Please enter your firstname.
							</Popover>
						}
					>
						<FormGroup controlId="firstname" validationState={this.props.validation}>
							<ControlLabel>Firstname</ControlLabel>
							<FormControl type="text" placeholder="Enter your firstname" ref="firstname" />
							<FormControl.Feedback />
						</FormGroup>
					</OverlayTrigger>

					<OverlayTrigger
						ref="emptyLastname"
						placement="right"
						overlay={
							<Popover id="popover-positioned-right">
								Please enter your lastname.
							</Popover>
						}
					>
						<FormGroup controlId="lastname" validationState={this.props.validation}>
							<ControlLabel>Lastname</ControlLabel>
							<FormControl type="text" placeholder="Enter your lastname" ref="lastname" />
							<FormControl.Feedback />
						</FormGroup>
					</OverlayTrigger>

					<OverlayTrigger
						ref="emptyEmail"
						placement="right"
						overlay={
							<Popover id="popover-positioned-right">
								Please enter your email.
							</Popover>
						}
					>
						<FormGroup controlId="email" validationState={this.props.validation}>
							<ControlLabel>Email</ControlLabel>
							<FormControl type="email" placeholder="Enter your email" ref="email" />
							<FormControl.Feedback />
						</FormGroup>
					</OverlayTrigger>

					<OverlayTrigger
						ref="emptyPassword"
						placement="right"
						overlay={
							<Popover id="popover-positioned-right">
								Please enter your password.
							</Popover>
						}
					>
						<FormGroup controlId="password" validationState={this.props.validation}>
							<ControlLabel>Password</ControlLabel>
							<FormControl type="password" placeholder="Enter your password" ref="password" />
							<FormControl.Feedback />
						</FormGroup>
					</OverlayTrigger>

					<OverlayTrigger
						ref="emptyAvatar"
						placement="right"
						overlay={
							<Popover id="popover-positioned-right">
								Please choose a file.
							</Popover>
						}
					>
						<FormGroup controlId="avatar">
							<ControlLabel>Avatar</ControlLabel>
							<input type="file" ref={(ref) => (this.fileUpload = ref)} />
						</FormGroup>
					</OverlayTrigger>

					<ButtonToolbar>
						<Button type="button" onClick={() => showModal(false)}>
							Close
						</Button>
						<Button
							onClick={!this.props.msg ? this.handleSubmit.bind(this) : this.resetForm.bind(this)}
							bsStyle={!this.props.style ? 'primary' : this.props.style}
						>
							{!this.props.msg ? 'Sign in' : this.props.msg}
						</Button>
					</ButtonToolbar>
				</Col>
			</Row>
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
		errorsUpload: state.upload.errors
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			addUser,
			uploadDocumentRequest,
			resetButton
		},
		dispatch
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeForm);
