import React from 'react';
import { ButtonToolbar, Button, Form, FormGroup, Col, Checkbox, FormControl, ControlLabel } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// @connect((state) => ({ users: state.user }), (dispatch) => bindActionCreators({ ...users }, dispatch))
class FormLogin extends React.Component {
	constructor(props) {
		super(props);

		this.state = { login: '', passwd: '', sendOn: false };
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
	submitValuesOfInputs(e) {
		const login = this.state.login,
			passwd = this.state.passwd;
	}

	// componentWillUpdate(nextProps, nextState) {
	// 	console.log(this);
	// 	debugger;
	// 	const { state } = this;
	// 	console.log({ state });
	// }
	componentDidUpdate() {
		const { login, passwd, sendOn } = this.state;

		if (!sendOn && login.length && passwd.length) {
			return this.setState({ sendOn: true });
		}

		if (sendOn && (!login.length || !passwd.length)) {
			return this.setState({ sendOn: false });
		}
	}

	render() {
		const { showModal } = this.props;

		return (
			<Form horizontal>
				<FormGroup controlId="formHorizontalLogin">
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
								type="submit"
								onClick={(login) => this.submitValuesOfInputs()}
								disabled={!this.state.sendOn}
							>
								Sign in
							</Button>
						</ButtonToolbar>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
export default FormLogin;
