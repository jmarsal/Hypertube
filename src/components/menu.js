import React from 'react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import ModalLogin from 'components/modals/modalLogin';

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
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default Menu;
