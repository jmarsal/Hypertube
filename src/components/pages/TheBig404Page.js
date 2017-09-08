import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, PageHeader } from 'react-bootstrap';

class TheBig404Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: ''
		};
	}

	render() {
		return (
			<Grid>
				<br />
				<Row>
					<PageHeader>Oops, where are you ?</PageHeader>
					<h3>404 Not Found</h3>
				</Row>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.users.sessionUser,
	};
}

export default connect(mapStateToProps)(TheBig404Page);
