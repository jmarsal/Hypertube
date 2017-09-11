import React from 'react';
import { Panel, Col, Button, Form, FormControl, FormGroup, Radio, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UsersActions from '../../actions/usersActions';

@connect(
	(state) => ({
		users: state.users.users,
		errorsLogin: state.users.info,
		messForget: state.users.mess,
		validEmailForget: state.users.validMail
	}),
	(dispatch) => bindActionCreators({ ...UsersActions }, dispatch)
)
class FilterPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			radioNameSort: 0,
			typeNameSort: '',
			radiotypeSort: 0,
			typeSort: '',
			genresSelected: [],
			qualitySelected: [],
			saisonsSelected: []
		};
	}

	nameSortChange(e) {
		const val = e.target.labels['0'].innerText;

		if (val === 'None') {
			this.setState({ radioNameSort: 0, typeNameSort: '' });
		} else if (val === 'A-Z') {
			this.setState({ radioNameSort: 1, typeNameSort: 'ASC' });
		} else if (val === 'Z-A') {
			this.setState({ radioNameSort: 2, typeNameSort: 'DESC' });
		}
		// test = e.currentTarget.filter((radio) => {
		// return radio.checked;
		// });
		debugger;
	}

	render() {
		const { showModal } = this.props;

		return (
			<Panel>
				<FormGroup>
					<ControlLabel>Name : </ControlLabel>
					<Form value={this.state.radioNameSort} onChange={(e) => this.nameSortChange(e)}>
						<Radio name="name-sort" inline checked={this.state.radioNameSort === 0 ? true : false}>
							None
						</Radio>
						<Radio name="name-sort" inline checked={this.state.radioNameSort === 1 ? true : false}>
							A-Z
						</Radio>
						<Radio name="name-sort" inline checked={this.state.radioNameSort === 2 ? true : false}>
							Z-A
						</Radio>
					</Form>
				</FormGroup>

				<FormGroup>
					<ControlLabel>Type : </ControlLabel>
					<Form>
						<Radio name="type-sort" inline checked>
							None
						</Radio>
						<Radio name="type-sort" inline>
							Movies
						</Radio>
						<Radio name="type-sort" inline>
							Series - TV Show
						</Radio>
					</Form>
				</FormGroup>
				<FormGroup controlId="formControlsSelectMultipleGenres">
					<ControlLabel>Genres :</ControlLabel>
					<FormControl componentClass="select" multiple>
						<option value="None">None</option>
						<option value="Action">Action</option>
						<option value="Horror">Horror</option>
						<option value="Drama">Drama</option>
						<option value="Comedy">Comedy</option>
					</FormControl>
				</FormGroup>
				<FormGroup controlId="formControlsSelectMultipleQuality">
					<ControlLabel>Quality :</ControlLabel>
					<FormControl componentClass="select" multiple>
						<option value="select">select (multiple)</option>
						<option value="other">...</option>
					</FormControl>
				</FormGroup>
				<FormGroup controlId="formControlsSelectMultipleSaisons">
					<ControlLabel>Saisons :</ControlLabel>
					<FormControl componentClass="select" multiple>
						<option value="select">select (multiple)</option>
						<option value="other">...</option>
					</FormControl>
				</FormGroup>
			</Panel>
		);
	}
}
export default FilterPage;
