import React from 'react';
import { Button } from 'react-bootstrap';
import FilterPage from 'components/pages/filterPage';
import withModal from 'components/modals/withModal';

// Inject showModal et getModal qui permette d'afficher une Modal
@withModal(FilterPage, 'Searching tools')
class ModalProfil extends React.Component {
	render() {
		const { showModal, getModal, showModalForget } = this.props;

		return (
			<Button bsStyle="primary" onClick={() => showModal(true)}>
				Searching tools
				{getModal()}
			</Button>
		);
	}
}
export default ModalProfil;
