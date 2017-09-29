import React, { Component } from 'react';
import {
	Alert,
	ButtonToolbar,
	Button,
	Form,
	FormGroup,
	Col,
	Checkbox,
	FormControl,
	ControlLabel,
	Image,
	Thumbnail
} from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UsersActions from '../../actions/usersActions';
import validator from 'validator';

@connect(
	(state) => ({
		users: state.users.users,
		errorsLogin: state.users.info,
		style: state.users.style,
		messForget: state.users.mess,
		validEmailForget: state.users.validMail
	}),
	(dispatch) => bindActionCreators({ ...UsersActions }, dispatch)
)
class FormLogin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			login: '',
			passwd: '',
			email: '',
			sendOn: false,
			forget: false,
			emailCheck: 'warning',
			loginCheck: 'warning',
			passwordCheck: 'warning'
		};
	}

	handleChange(e) {
		const inputId = e.target.id,
			val = e.target.value;

		if (inputId === 'formHorizontalLogin') {
			if (val.length > 0 && val.length < 31) {
				this.setState({ loginCheck: 'success' });
			} else {
				this.setState({ loginCheck: 'warning' });
			}
			this.setState({ login: val });
		}
		if (inputId === 'formHorizontalPassword') {
			if (val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')) {
				this.setState({ passwordCheck: 'success' });
			} else {
				this.setState({ passwordCheck: 'warning' });
			}
			this.setState({ passwd: val });
		}

		if (this.state.loginCheck === 'success' && this.state.passwordCheck === 'success') {
			this.setState({ sendOn: true });
		}
		if (inputId === 'formEmail') {
			if (validator.isEmail(val)) {
				this.setState({ email: val, emailCheck: 'success' });
			} else {
				this.setState({ emailCheck: 'warning' });
			}
		}
	}

	submitValuesOfInputs() {
		const user = {
			username: validator.escape(this.state.login).trim(),
			password: validator.escape(this.state.passwd).trim()
		};

		if (user.username.length && user.password.length) {
			const { checkUserForConnect } = this.props;

			checkUserForConnect(user);
		}
	}

	// CHANGE LE TITRE DE LA MODAL ET LE CONTENU SI CLICK SUR FORGET
	forgetPasswd() {
		const { changeTitle } = this.props;

		changeTitle('Forget Username or Password ?');
		return this.setState({ forget: true });
	}

	submitEmailForReinit() {
		const email = this.state.email.trim();

		if (email.length) {
			const { sendMailForgetIdConnect } = this.props;
			sendMailForgetIdConnect(email);
		}
	}

	componentDidUpdate() {
		const { login, passwd, sendOn, emailCheck, email } = this.state;

		if (
			!sendOn &&
			login.length > 0 &&
			login.length < 31 &&
			passwd.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
		) {
			return this.setState({ sendOn: true, loginCheck: 'success', passwordCheck: 'success' });
		}

		if (emailCheck === 'warning' && validator.isEmail(email)) {
			return this.setState({ emailCheck: 'success' });
		}
		if (emailCheck === 'success' && !validator.isEmail(email)) {
			this.setState({ emailCheck: 'warning' });
		}

		if (
			sendOn &&
			(login.length < 1 ||
				login.length > 30 ||
				!passwd.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i'))
		) {
			return this.setState({ sendOn: false, loginCheck: 'warning', passwordCheck: 'warning' });
		}
	}

	render() {
		const { showModal, errorsLogin, style, validEmailForget, messForget } = this.props;

		return this.state.forget == false ? (
			<Form horizontal>
				<FormGroup>
					<Col smOffset={2} sm={10} className={'z_index_up'}>
						<h5>Login from 42, Facebook, Google, Twitter, Github</h5>
						<Col xs={2}>
							<a href="/api/auth/42">
								<div className="logoOauth school42" />
							</a>
						</Col>
						<Col xs={2}>
							<a href="/api/auth/facebook">
								<div className="logoOauth facebook" />
							</a>
						</Col>
						<Col xs={2}>
							<a href="/api/auth/google">
								<div className="logoOauth google" />
							</a>
						</Col>
						<Col xs={2}>
							<a href="/api/auth/twitter">
								<div className="logoOauth twitter" />
							</a>
						</Col>
						<Col xs={2}>
							<a href="/api/auth/github">
								<div className="logoOauth github" />
							</a>
						</Col>
					</Col>
					<Col smOffset={5} sm={10}>
						<h5>Or manually</h5>
					</Col>
				</FormGroup>
				<FormGroup controlId="formHorizontalLogin" validationState={this.state.loginCheck}>
					<Col sm={12}>{errorsLogin ? <Alert bsStyle={style}>{errorsLogin}</Alert> : ''}</Col>
					<Col componentClass={ControlLabel} sm={2}>
						Login
					</Col>
					<Col sm={10}>
						<FormControl
							type="text"
							placeholder="Login"
							ref="login"
							value={this.state.login}
							onChange={(e) => this.handleChange(e)}
							autoFocus="true"
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="formHorizontalPassword" validationState={this.state.passwordCheck}>
					<Col componentClass={ControlLabel} sm={2}>
						Password
					</Col>
					<Col sm={10}>
						<FormControl
							type="password"
							placeholder="Password"
							ref="passwd"
							value={this.state.passwd}
							onChange={(e) => this.handleChange(e)}
						/>
					</Col>
				</FormGroup>

				<FormGroup>
					<Col smOffset={2} sm={10}>
						<ButtonToolbar>
							<Button type="button" onClick={() => showModal(false)}>
								Close
							</Button>
							<Button
								bsStyle="primary"
								type="button"
								onClick={() => this.submitValuesOfInputs()}
								disabled={!this.state.sendOn}
							>
								Log in
							</Button>
						</ButtonToolbar>
					</Col>
					<hr />
					<Col smOffset={7} sm={12}>
						<Button bsStyle="default" type="button" onClick={() => this.forgetPasswd()}>
							Forgot Login Or Password ?
						</Button>
					</Col>
				</FormGroup>
			</Form>
		) : (
			<Form horizontal>
				<FormGroup controlId="formEmail" validationState={this.state.emailCheck}>
					<Col sm={12}>
						{messForget ? (
							<Alert bsStyle={validEmailForget ? 'success' : 'danger'}>{messForget}</Alert>
						) : (
							''
						)}
					</Col>
					<Col smOffset={2} sm={10}>
						<h5>Enter your email and you will recept a mail for reinitialisation</h5>
						<ControlLabel>Email</ControlLabel>
						<FormControl
							type="email"
							placeholder="Enter your email"
							ref="email"
							onChange={(e) => this.handleChange(e)}
							autoFocus="true"
						/>
						<FormControl.Feedback />
					</Col>
				</FormGroup>
				<FormGroup>
					<Col smOffset={2} sm={10}>
						<ButtonToolbar>
							<Button type="button" onClick={() => showModal(false)}>
								Close
							</Button>
							<Button
								bsStyle="primary"
								type="button"
								onClick={() => this.submitEmailForReinit()}
								disabled={this.state.emailCheck === 'success' ? false : true}
							>
								Reinitialisation
							</Button>
						</ButtonToolbar>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
export default FormLogin;
