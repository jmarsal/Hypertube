import React from 'react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import ModalLogin from 'components/modals/modalLogin';
import ModalSubscribe from 'components/modals/modalSubscribe';

class Menu extends React.Component {
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
					<Nav pullRight>
						<ModalLogin />
						<ModalSubscribe />
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default Menu;
