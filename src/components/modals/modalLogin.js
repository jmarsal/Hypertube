import React from 'react';
import { Button, NavItem } from 'react-bootstrap';

import FormLogin from 'components/forms/FormLogin';
import withModal from 'components/modals/withModal';

// Inject showModal et getModal qui permette d'afficher une Modal
@withModal(FormLogin, 'Login')
class ModalLogin extends React.Component {
	render() {
		const { showModal, getModal, showModalForget } = this.props;

		return (
			<NavItem onClick={() => showModal(true)}>
				Login
				{getModal()}
			</NavItem>
		);
	}
}
export default ModalLogin;
