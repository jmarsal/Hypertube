import React from 'react';
import { Button, NavItem } from 'react-bootstrap';

import SubscribeForm from 'components/forms/subscribeForm';
import withModal from 'components/modals/withModal';

// Inject showModal et getModal qui permette d'afficher une Modal
@withModal(SubscribeForm, 'Register')
class ModalSubscribe extends React.Component {
	render() {
		const { showModal, getModal } = this.props;

		return (
			<NavItem onClick={() => showModal(true)}>
				Register
				{getModal()}
			</NavItem>
		);
	}
}
export default ModalSubscribe;
