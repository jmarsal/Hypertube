import React from 'react';
import { Panel, Col, Button, Form, FormControl, FormGroup, Radio, Checkbox, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CollectionActions from '../../actions/collectionsActions';
import { FormattedMessage, injectIntl } from 'react-intl';

import InputRange from 'react-input-range';

// To include the default styles
import 'react-input-range/lib/css/index.css';

@connect(
	(state) => ({
		filters: state.filters,
		genres: state.collection.allGenres,
		quality: state.collection.allQuality,
		seasons: state.collection.allSeasons,
		notesMinMax: state.collection.notesMinMax,
		notesMinMaxRange: state.collection.notesMinMaxRange,
		yearsMinMax: state.collection.yearsMinMax,
		yearsMinMaxRange: state.collection.yearsMinMaxRange,
		noteActive: state.collection.noteActive,
		yearActive: state.collection.yearActive
	}),
	(dispatch) => bindActionCreators({ ...CollectionActions }, dispatch)
)
class FilterPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			titleVideo: this.props.title
		};
	}

	getNewFilterEvent(e) {
		// debugger;
		const {
			getCollectionsByFilters,
			filters,
			changeStatusNote,
			changeStatusYear,
			changeActualNote,
			changeActualYear,
			notesMinMaxRange,
			yearsMinMaxRange
		} = this.props;

		if (
			!e.yearActive &&
			!e.noteActive &&
			!e.note &&
			!e.year &&
			(e.currentTarget.name === 'name-sort' || e.currentTarget.name === 'type-sort')
		) {
			if (e.currentTarget.name === 'name-sort') {
				filters.titleOrder =
					e.target.labels['0'].innerText !== 'None'
						? e.target.labels['0'].innerText === 'A-Z' ? 'asc' : 'desc'
						: '';
			} else {
				filters.type =
					e.target.labels['0'].innerText !== 'None'
						? e.target.labels['0'].innerText === 'Movies' ? 'movie' : 'serie'
						: '';
			}
		}
		if (
			!e.yearActive &&
			!e.noteActive &&
			!e.note &&
			!e.year &&
			e.target.selectedOptions &&
			e.target.selectedOptions['select-genre']
		) {
			filters.genre = e.target.value !== 'None' ? e.target.value : '';
		}
		if (
			!e.yearActive &&
			!e.noteActive &&
			!e.note &&
			!e.year &&
			e.target.selectedOptions &&
			e.target.selectedOptions['select-quality']
		) {
			filters.quality = e.target.value !== 'None' ? e.target.value : '';
		}
		if (
			!e.yearActive &&
			!e.noteActive &&
			!e.note &&
			!e.year &&
			e.target.selectedOptions &&
			e.target.selectedOptions['select-season']
		) {
			filters.season = e.target.value !== 'None' ? e.target.value : '';
		}
		if (e.note && this.props.noteActive) {
			changeActualNote({ noteRange: e.note });
			filters.note = e.note;
		} else if (e.note && !this.props.noteActive) {
			changeActualNote({ noteRange: e.note });
		}
		if (e.noteActive && this.props.noteActive) {
			changeStatusNote({ noteActive: false });
			filters.noteActive = false;
		} else if (e.noteActive && !this.props.noteActive) {
			changeStatusNote({ noteActive: true });
			filters.note = notesMinMaxRange;
			filters.noteActive = true;
		}
		if (e.year && this.props.yearActive) {
			changeActualYear({ yearRange: e.year });
			filters.year = e.year;
		} else if (e.year && !this.props.yearActive) {
			changeActualYear({ yearRange: e.year });
		}
		if (e.yearActive && this.props.yearActive) {
			changeStatusYear({ yearActive: false });
			filters.yearActive = false;
		} else if (e.yearActive && !this.props.yearActive) {
			changeStatusYear({ yearActive: true });
			filters.year = yearsMinMaxRange;
			filters.yearActive = true;
		}
		// debugger;
		/////////////////////////////////////////////////////////////////////////////
		getCollectionsByFilters(this.state.titleVideo, filters);
	}

	resetAllFilters() {
		const { resetFiltersUserChoiceInStore, resetAllFilters, getCollectionsByFilters } = this.props;

		resetFiltersUserChoiceInStore();
		resetAllFilters();
		getCollectionsByFilters(this.state.titleVideo, {});
	}

	render() {
		const {
			showModal,
			filters,
			genres,
			quality,
			seasons,
			notesMinMax,
			notesMinMaxRange,
			yearsMinMax,
			yearsMinMaxRange
		} = this.props;

		return (
			<Panel>
				<FormGroup>
					<ControlLabel>Name : </ControlLabel>
					<Form>
						<Radio
							name="name-sort"
							inline
							onChange={(e) => this.getNewFilterEvent(e)}
							checked={
								filters && (filters.titleOrder === 'asc' || filters.titleOrder === 'desc') ? (
									false
								) : (
									true
								)
							}
						>
							None
						</Radio>
						<Radio
							name="name-sort"
							inline
							onChange={(e) => this.getNewFilterEvent(e)}
							checked={filters && filters.titleOrder === 'asc' ? true : false}
						>
							A-Z
						</Radio>
						<Radio
							name="name-sort"
							inline
							onChange={(e) => this.getNewFilterEvent(e)}
							checked={filters && filters.titleOrder === 'desc' ? true : false}
						>
							Z-A
						</Radio>
					</Form>
				</FormGroup>

				<FormGroup>
					<ControlLabel>Type : </ControlLabel>
					<Form>
						<Radio
							name="type-sort"
							inline
							onChange={(e) => this.getNewFilterEvent(e)}
							checked={filters && (filters.type === 'movie' || filters.type === 'serie') ? false : true}
						>
							None
						</Radio>
						<Radio
							name="type-sort"
							inline
							onChange={(e) => this.getNewFilterEvent(e)}
							checked={filters && filters.type === 'movie' ? true : false}
						>
							Movies
						</Radio>
						<Radio
							name="type-sort"
							inline
							onChange={(e) => this.getNewFilterEvent(e)}
							checked={filters && filters.type === 'serie' ? true : false}
						>
							Series - TV Show
						</Radio>
					</Form>
				</FormGroup>
				<FormGroup>
					<ControlLabel>Note IMDB : </ControlLabel>
					<Form>
						<Checkbox
							checked={this.props.noteActive}
							onChange={(value) => this.getNewFilterEvent({ noteActive: value })}
						>
							{this.props.noteActive ? 'On' : 'Off'}
						</Checkbox>
						<InputRange
							draggableTrack={true}
							maxValue={notesMinMax.max}
							minValue={notesMinMax.min}
							value={notesMinMaxRange}
							onChange={(value) => this.getNewFilterEvent({ note: value })}
						/>
					</Form>
				</FormGroup>
				<FormGroup>
					<ControlLabel>Year : </ControlLabel>
					<Form>
						<Checkbox
							checked={this.props.yearActive}
							onChange={(value) => this.getNewFilterEvent({ yearActive: value })}
						>
							{this.props.yearActive ? 'On' : 'Off'}
						</Checkbox>
						<InputRange
							draggableTrack={true}
							maxValue={yearsMinMax.max}
							minValue={yearsMinMax.min}
							value={yearsMinMaxRange}
							onChange={(value) => this.getNewFilterEvent({ year: value })}
						/>
					</Form>
				</FormGroup>
				<FormGroup controlId="formControlsSelectGenres">
					<ControlLabel>Genres :</ControlLabel>
					<FormControl
						componentClass="select"
						value={filters.genre ? filters.genre : 'None'}
						onChange={(e) => this.getNewFilterEvent(e)}
					>
						<option name="select-genre" key="None">
							None
						</option>
						{genres ? (
							genres.map((genre) => {
								return (
									<option name="select-genre" key={genre.val}>
										{genre.val}
									</option>
								);
							})
						) : null}
					</FormControl>
				</FormGroup>
				{(filters.type && filters.type !== 'movie') || !filters.type ? (
					<FormGroup controlId="formControlsSelectMultipleSaisons">
						<ControlLabel>Saisons :</ControlLabel>
						<FormControl
							componentClass="select"
							value={filters.season ? filters.season : 'None'}
							onChange={(e) => this.getNewFilterEvent(e)}
						>
							<option name="select-quality" key="None">
								None
							</option>
							{seasons ? (
								seasons.map((season) => {
									if (season && season.val) {
										return (
											<option name="select-season" key={season.val}>
												{season.val}
											</option>
										);
									}
								})
							) : null}
						</FormControl>
					</FormGroup>
				) : null}
				<FormGroup controlId="formControlsSelectQuality">
					<ControlLabel>Quality :</ControlLabel>
					<FormControl
						componentClass="select"
						value={filters.quality ? filters.quality : 'None'}
						onChange={(e) => this.getNewFilterEvent(e)}
					>
						<option name="select-quality" key="None">
							None
						</option>
						{quality ? (
							quality.map((result) => {
								return (
									<option name="select-quality" key={result.val}>
										{result.val !== '3D' ? result.val + 'p' : result.val}
									</option>
								);
							})
						) : null}
					</FormControl>
				</FormGroup>
				<Col smOffset={4} xs={12} md={10} lg={8}>
					<Button bsStyle="danger" onClick={() => this.resetAllFilters()}>
						Reset Filters
					</Button>
				</Col>
			</Panel>
		);
	}
}
export default FilterPage;
