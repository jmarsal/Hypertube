import React from 'react';
import { Button } from 'react-bootstrap';
import FilterPage from 'components/pages/filterPage';
import withModal from 'components/modals/withModal';
import { FormattedMessage, injectIntl } from 'react-intl';

// Inject showModal et getModal qui permette d'afficher une Modal
@withModal(FilterPage, <FormattedMessage id="searching_tools" />)
class ModalProfil extends React.Component {
	render() {
		const { showModal, getModal, showModalForget } = this.props;

		return (
			<Button bsStyle="primary" onClick={() => showModal(true)}>
				<FormattedMessage id="searching_tools" />
				{getModal()}
			</Button>
		);
	}
}
export default ModalProfil;
