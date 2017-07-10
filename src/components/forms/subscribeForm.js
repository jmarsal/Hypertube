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
	Form,
	ControlLabel,
	ButtonToolbar,
	Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom';
import { addUser, resetButton } from '../../actions/usersActions';
import { uploadDocumentRequest } from '../../actions/uploadActions';
import path from 'path';

class SubscribeForm extends React.Component {
	constructor() {
		super();
		this.state = {
			sizeError: ''
		};
	}

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
					if (this.fileUpload.files[0].size > 5000000) {
						this.setState({ sizeError: 'Avatar: File too big.' });
					} else {
						const file = this.fileUpload.files[0];
						this.props.uploadDocumentRequest({
							file,
							name: filename
						});
					}
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
					</Col>
				</FormGroup>
				<FormGroup controlId="username" validationState={this.props.validation}>
					<Col componentClass={ControlLabel} sm={2}>
						Login
					</Col>
					<Col sm={10}>
						<FormControl type="text" placeholder="Enter your login" ref="username" />
						<FormControl.Feedback />
					</Col>
				</FormGroup>

				<FormGroup controlId="firstname" validationState={this.props.validation}>
					<Col componentClass={ControlLabel} sm={2}>
						Firstname
					</Col>
					<Col sm={10}>
						<FormControl type="text" placeholder="Enter your firstname" ref="firstname" />
						<FormControl.Feedback />
					</Col>
				</FormGroup>

				<FormGroup controlId="lastname" validationState={this.props.validation}>
					<Col componentClass={ControlLabel} sm={2}>
						Lastname
					</Col>
					<Col sm={10}>
						<FormControl type="text" placeholder="Enter your lastname" ref="lastname" />
						<FormControl.Feedback />
					</Col>
				</FormGroup>

				<FormGroup controlId="email" validationState={this.props.validation}>
					<Col componentClass={ControlLabel} sm={2}>
						Email
					</Col>
					<Col sm={10}>
						<FormControl type="email" placeholder="Enter your email" ref="email" />
						<FormControl.Feedback />
					</Col>
				</FormGroup>

				<FormGroup controlId="password" validationState={this.props.validation}>
					<Col componentClass={ControlLabel} sm={2}>
						Password
					</Col>
					<Col sm={10}>
						<FormControl type="password" placeholder="Enter your password" ref="password" />
						<FormControl.Feedback />
					</Col>
				</FormGroup>

				<FormGroup controlId="avatar">
					<Col componentClass={ControlLabel} sm={2}>
						Avatar
					</Col>
					<Col sm={10}>
						<input type="file" ref={(ref) => (this.fileUpload = ref)} />
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={10}>
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
