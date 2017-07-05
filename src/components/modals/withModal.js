import React from 'react';
import { Modal } from 'react-bootstrap';

const withModal = (Content, title) => (WrappedComponent) => {
	return class withModal extends React.Component {
		constructor(props) {
			super(props);

			this.state = { showModal: false };
		}

		showModal(visible) {
			this.setState({ showModal: visible });
		}

		getModal() {
			const { showModal } = this.state;

			return (
				<Modal show={showModal} onHide={() => this.showModal(false)}>
					<Modal.Header closeButton>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Content showModal={(visible) => this.showModal(visible)} {...this.props} />
					</Modal.Body>
				</Modal>
			);
		}

		render() {
			const { children } = this.props;

			return (
				<WrappedComponent
					getModal={() => this.getModal()}
					showModal={(visible) => this.showModal(visible)}
					{...this.props}
				/>
			);
		}
	};
};
export default withModal;
