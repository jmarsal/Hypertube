import React from 'react';
import { Nav, NavItem, Navbar, Button } from 'react-bootstrap';
import ModalLogin from 'components/modals/modalLogin';
import ModalSubscribe from 'components/modals/modalSubscribe';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserFromSession, disconnectUser } from '../actions/usersActions';

class Menu extends React.Component {
	componentDidMount() {
		this.props.getUserFromSession();
	}

	handleDisconnect() {
		console.log('test');
		this.props.disconnectUser();
	}

	render() {
		return (
			<Navbar inverse fixedTop>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="/">Hypertube</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>

					{!this.props.sessionUser
						? <Nav pullRight>
								<ModalLogin />
								<ModalSubscribe />
							</Nav>
						: <Nav pullRight>
								<NavItem onClick={this.handleDisconnect.bind(this)}>
									Disconnect
								</NavItem>
							</Nav>}

				</Navbar.Collapse>
			</Navbar>
		);
	}
}

function mapStateToProps(state) {
	return {
		sessionUser: state.users.sessionUser,
		msg: state.users.msg,
		style: state.users.style
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getUserFromSession,
			disconnectUser
		},
		dispatch
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
