import React from 'react';
import { Form, FormGroup, FormControl, Col, Alert, ControlLabel, ButtonToolbar, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';

import * as UsersActions from '../../actions/usersActions';

@connect(
	(state) => ({
		users: state.users.users,
		activation: state.users.activation,
		successUpdatePassword: state.users.successUpdatePasswd,
		mess: state.users.mess
	}),
	(dispatch) => bindActionCreators({ ...UsersActions }, dispatch)
)
class ReinitPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			password: '',
			confirmPassword: '',
			sendOn: false,
			passwordCheck: 'warning',
			confirmPasswordCheck: 'warning'
		};
	}

	componentDidMount() {
		const { key, user } = this.props.location.query;
		const { activateAccount } = this.props;

		if (key && user) {
			activateAccount(key, user);
		}
	}

	handleChange(e) {
		const inputId = e.target.id,
			val = e.target.value;

		if (inputId === 'formHorizontalPassword') {
			this.setState({ password: val });
			if (val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')) {
				if (this.state.confirmPasswordCheck === 'success' && val !== this.state.confirmPassword) {
					this.setState({ confirmPasswordCheck: 'warning' });
					this.setState({ sendOn: false });
				} else if (this.state.confirmPasswordCheck === 'warning' && val === this.state.confirmPassword) {
					this.setState({ confirmPasswordCheck: 'success' });
					this.setState({ sendOn: true });
				} else {
					this.setState({ passwordCheck: 'success' });
				}
			} else {
				this.setState({ passwordCheck: 'warning' });
			}
		}

		if (inputId === 'formHorizontalPasswordConfirm') {
			this.setState({ confirmPassword: val });
			if (val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i') && this.state.password === val) {
				this.setState({ confirmPasswordCheck: 'success' });
				this.setState({ sendOn: true });
			} else {
				this.setState({ confirmPasswordCheck: 'warning' });
				this.setState({ sendOn: false });
			}
		}
	}

	submitValuesOfInputs() {
		const { updatePassword } = this.props;
		const { user } = this.props.location.query;
		const userToUpdate = {
			username: user,
			password: validator.escape(this.state.password).trim()
		};
		updatePassword(userToUpdate);
	}

	redirect() {
		setTimeout(function() {
			window.location.href = '/';
		}, 1000);
	}

	render() {
		const { activation, successUpdatePassword, mess } = this.props;
		const { user } = this.props.location.query;
		const messAlertFaillure = 'Something goes wrong ' + user + '... Please try again.',
			messAlertSuccess = 'Activation success ' + user + ', you can now choose a new password.';

		if (this.props.activation) {
			return (
				<Form horizontal>
					<FormGroup>
						<Col smOffset={5} sm={2}>
							{!mess ? <Alert bsStyle="success">{messAlertSuccess}</Alert> : ''}

							{mess ? <Alert bsStyle={successUpdatePassword ? 'success' : 'danger'}>{mess}</Alert> : ''}
						</Col>
					</FormGroup>

					<FormGroup controlId="formHorizontalPassword" validationState={this.state.passwordCheck}>
						<Col componentClass={ControlLabel} smOffset={3} sm={2}>
							<FormattedMessage id="new_password" />
						</Col>
						<Col sm={2}>
							<FormControl
								type="password"
								placeholder="New Password"
								ref="password"
								value={this.state.password}
								onChange={(e) => this.handleChange(e)}
							/>
						</Col>
					</FormGroup>

					<FormGroup
						controlId="formHorizontalPasswordConfirm"
						validationState={this.state.confirmPasswordCheck}
					>
						<Col componentClass={ControlLabel} smOffset={3} sm={2}>
							<FormattedMessage id="confirm_password" />
						</Col>
						<Col sm={2}>
							<FormControl
								type="password"
								placeholder="Confirm Password"
								ref="confirmPassword"
								value={this.state.confirmPassword}
								onChange={(e) => this.handleChange(e)}
							/>
						</Col>
					</FormGroup>

					<FormGroup>
						<Col smOffset={5} sm={10}>
							{successUpdatePassword ? (
								this.redirect()
							) : (
								<Button
									bsStyle="primary"
									type="button"
									onClick={() => this.submitValuesOfInputs()}
									disabled={!this.state.sendOn}
								>
									<FormattedMessage id="save_password" />
								</Button>
							)}
						</Col>
					</FormGroup>
				</Form>
			);
		} else {
			return (
				<Form horizontal>
					<FormGroup>
						<Col smOffset={5} sm={2}>
							{!mess ? <Alert bsStyle="danger">{messAlertFaillure}</Alert> : ''}
						</Col>
					</FormGroup>
				</Form>
			);
		}
	}
}

export default ReinitPage;
