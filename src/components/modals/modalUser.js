import React from 'react';
import { Button, NavItem } from 'react-bootstrap';
import UserPage from 'components/pages/userPage';
import withModal from 'components/modals/withModal';

// Inject showModal et getModal qui permette d'afficher une Modal
@withModal(UserPage, 'User')
class ModalUser extends React.Component {
	render() {
		const { showModal, getModal, showModalForget } = this.props;

		return (
			<NavItem onClick={() => showModal(true)}>
				User
				{getModal()}
			</NavItem>
		);
	}
}
export default ModalUser;
