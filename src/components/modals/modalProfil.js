import React from 'react';
import { Button, NavItem } from 'react-bootstrap';
import ProfilPage from 'components/pages/profilPage';
import withModal from 'components/modals/withModal';

// Inject showModal et getModal qui permette d'afficher une Modal
@withModal(ProfilPage, 'Profil')
class ModalProfil extends React.Component {
	render() {
		const { showModal, getModal, showModalForget } = this.props;

		return (
			<NavItem onClick={() => showModal(true)}>
				Profil
				{getModal()}
			</NavItem>
		);
	}
}
export default ModalProfil;
