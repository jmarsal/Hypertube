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
	ControlLabel
} from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UsersActions from '../../actions/usersActions';
import validator from 'validator';

@connect(
	(state) => ({
		users: state.users.users,
		errorsLogin: state.users.info,
		style: state.users.style
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
			if (val.length > 2 && val.length < 15) {
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
		const user = {
			email: validator.escape(this.state.email).trim()
		};

		if (user.email.length) {
			const { sendMailForgetIdConnect } = this.props;

			sendMailForgetIdConnect(user);
		}
	}

	componentDidUpdate() {
		const { login, passwd, sendOn } = this.state;

		if (
			!sendOn &&
			login.length > 2 &&
			login.length < 15 &&
			passwd.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
		) {
			return this.setState({ sendOn: true, loginCheck: 'success', passwordCheck: 'success' });
		}

		if (
			sendOn &&
			(login.length < 3 ||
				login.length > 14 ||
				!passwd.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i'))
		) {
			return this.setState({ sendOn: false, loginCheck: 'warning', passwordCheck: 'warning' });
		}
	}

	render() {
		const { showModal, errorsLogin, style } = this.props;
		return this.state.forget == false
			? <Form horizontal>
					<FormGroup controlId="formHorizontalLogin" validationState={this.state.loginCheck}>
						<Col sm={12}>
							{errorsLogin
								? <Alert bsStyle={style}>
										{errorsLogin}
									</Alert>
								: ''}
						</Col>
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
							<Checkbox>Remember me</Checkbox>
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
									Sign in
								</Button>
							</ButtonToolbar>
						</Col>
						<hr />
						<Col smOffset={7} sm={12}>
							<Button bsStyle="default" type="button" onClick={() => this.forgetPasswd()}>
								Forget Login Or Password ?
							</Button>
						</Col>
					</FormGroup>
				</Form>
			: <Form horizontal>
					<FormGroup controlId="formEmail" validationState={this.state.emailCheck}>
						<Col smOffset={2} sm={10}>
							<h5>Enter your email and you will recept a mail for reinitialisation</h5>
							<ControlLabel>Email</ControlLabel>
							<FormControl
								type="email"
								placeholder="Enter your email"
								ref="email"
								onChange={(e) => this.handleChange(e)}
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
				</Form>;
	}
}
export default FormLogin;
