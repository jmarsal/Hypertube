import React from 'react';
import { browserHistory } from 'react-router';
import { Nav, NavItem, Navbar, Button, NavDropdown, MenuItem } from 'react-bootstrap';
import ModalLogin from 'components/modals/modalLogin';
import ModalSubscribe from 'components/modals/modalSubscribe';
import ModalProfil from 'components/modals/modalProfil';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import { getUserFromSession, disconnectUser, changeUserLanguage } from '../actions/usersActions';
import ReinitPage from './pages/forgetPasswdUsernamePage';

class Menu extends React.Component {
	componentDidMount() {
		this.props.getUserFromSession();
	}

	handleDisconnect() {
		this.props.disconnectUser();
		browserHistory.push('/');
	}

	handleLanguage(language) {
		this.props.changeUserLanguage(language);
	}

	render() {
		return (
			<Navbar inverse fixedTop>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="/">
							<img src="/favicon.ico" className={'logo_navbar'} /> Hypertube
						</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					{!this.props.sessionUser ? (
						<Nav pullRight>
							<ModalLogin />
							<ModalSubscribe />
						</Nav>
					) : (
						<Nav pullRight>
							<NavItem href="/">Collection</NavItem>
							<ModalProfil />
							<NavItem onClick={this.handleDisconnect.bind(this)}>
								<FormattedMessage id="disconnect" />
							</NavItem>
							<NavDropdown
								title={
									this.props.language ? (
										this.props.language.toUpperCase()
									) : this.props.sessionUser.language ? (
										this.props.sessionUser.language.toUpperCase()
									) : (
										'EN'
									)
								}
								id="choose-language"
							>
								<MenuItem onClick={() => this.handleLanguage('fr')}>FR</MenuItem>
								<MenuItem onClick={() => this.handleLanguage('en')}>EN</MenuItem>
							</NavDropdown>
						</Nav>
					)}
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

function mapStateToProps(state) {
	return {
		sessionUser: state.users.sessionUser,
		msg: state.users.msg,
		style: state.users.style,
		language: state.users.language
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getUserFromSession,
			disconnectUser,
			changeUserLanguage
		},
		dispatch
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
