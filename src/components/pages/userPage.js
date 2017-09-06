import React from 'react';
import {
	Panel,
	Col,
	Image,
	Button,
	Form,
	FormControl,
	FormGroup,
	ButtonToolbar,
	ControlLabel,
	Alert
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class UserPage extends React.Component {
	render() {
		return <Panel />;
	}
}

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
