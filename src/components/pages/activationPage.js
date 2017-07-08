import React from 'react';
import { Grid, Row, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { activateAccount } from '../../actions/usersActions';

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
					{this.props.activation
						? <Panel header="Activation success" bsStyle="success">
								Activation success, you can now log in.
							</Panel>
						: <Panel header="Activation error" bsStyle="danger">
								Something goes wrong... Please try again.
							</Panel>}
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
