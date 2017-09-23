import React from 'react';
import { Grid, Row, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { activateAccount } from '../../actions/usersActions';
import { FormattedMessage } from 'react-intl';

class ActivationPage extends React.Component {
	componentDidMount() {
		if (this.props.location.query.key && this.props.location.query.user) {
			this.props.activateAccount(this.props.location.query.key, this.props.location.query.user);
		}
	}

	render() {
		return (
			<Grid>
				<Row>
					{this.props.activation ? (
						<Panel header="Activation success" bsStyle="success">
							<FormattedMessage id="activation_success" />
						</Panel>
					) : (
						<Panel header="Activation error" bsStyle="danger">
							<FormattedMessage id="activation_error" />
						</Panel>
					)}
				</Row>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		activation: state.users.activation
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			activateAccount
		},
		dispatch
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivationPage);
