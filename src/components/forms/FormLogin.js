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

		this.state = { login: '', passwd: '', sendOn: false, forget: false };
	}

	handleChange(e) {
		const inputId = e.target.id,
			val = e.target.value;

		if (inputId === 'formHorizontalLogin') {
			this.setState({ login: val });
		}
		if (inputId === 'formHorizontalPassword') {
			this.setState({ passwd: val });
		}
	}

	submitValuesOfInputs() {
		const user = {
			username: this.state.login,
			password: this.state.passwd
		};

		if (user.username.length && user.password.length) {
			const { checkUserForConnect } = this.props;
			checkUserForConnect(user);
		}
	}

	forgetPasswd() {
		const { changeTitle } = this.props;

		changeTitle('Forget Username or Password ?');
		return this.setState({ forget: true });
	}

	componentDidUpdate() {
		const { login, passwd, sendOn } = this.state;

		if (!sendOn && login.length && passwd.length) {
			return this.setState({ sendOn: true });
		}

		if (sendOn && (!login.length || !passwd.length)) {
			showModal(false);
			return this.setState({ sendOn: false });
		}
	}

	render() {
		const { showModal, errorsLogin, style } = this.props;
		return this.state.forget == false
			? <Form horizontal>
					<FormGroup controlId="formHorizontalLogin">
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

					<FormGroup controlId="formHorizontalPassword">
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
					<FormGroup>
						<h5>Enter your email and you will recept a mail for reinitialisation</h5>
						<ControlLabel>Email</ControlLabel>
						<FormControl type="email" placeholder="Enter your email" ref="email" />
						<FormControl.Feedback />
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
									Reinitialisation
								</Button>
							</ButtonToolbar>
						</Col>
					</FormGroup>
				</Form>;
	}
}
export default FormLogin;
