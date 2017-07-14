import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Grid,
	Row,
	Col,
	Form,
	FormGroup,
	FormControl,
	Image,
	ListGroup,
	ListGroupItem,
	Well,
	PageHeader
} from 'react-bootstrap';

import { getUserFromSession, disconnectUser } from '../../actions/usersActions';
import * as Collections from '../../actions/collectionsActions';

@connect(
	(state) => ({
		sessionUser: state.users.sessionUser,
		msg: state.users.msg,
		style: state.users.style,
		collection: state.collection.collection
	}),
	(dispatch) =>
		bindActionCreators(
			{
				...Collections,
				getUserFromSession,
				disconnectUser
			},
			dispatch
		)
)
class HomePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchRequest: '',
			pageRequestDb: 1
		};
	}

	getMovies(e) {
		const { getCollectionsListByName } = this.props,
			inputId = e.target.id,
			val = e.target.value;

		if (inputId === 'formControlsText') {
			getCollectionsListByName(val, this.state.pageRequestDb);
		}
		//requete db des movies...
	}

	componentDidMount() {
		const { getCollectionsListByName } = this.props;

		getCollectionsListByName('', 1);
	}

	render() {
		const { collection } = this.props;

		return !this.props.sessionUser
			? <Grid>
					<Row>Blablabla</Row>
				</Grid>
			: <Grid>
					<Row>
						<PageHeader>Collections Movies and TV Show</PageHeader>
						<Form horizontal>
							<FormGroup>
								<Col smOffset={2} xs={8} md={8} lg={8}>
									<FormControl
										id="formControlsText"
										type="text"
										label="Text"
										placeholder="Find Movies, TV Show..."
										autoFocus="true"
										onChange={(e) => this.getMovies(e)}
									/>
								</Col>
							</FormGroup>
							<Col smOffset={0} xs={12} md={12} lg={12}>
								{collection
									? collection.map((movie, index) => {
											return (
												<ListGroup key={index}>
													<ListGroupItem>
														<Well>
															{movie.title}
														</Well>
														<div className="year-collection">
															<span>
																{movie.year}
															</span>
														</div>
														<div className="img-collection">
															<Image key={movie.cover} src={movie.cover} responsive />
														</div>

														<Well>
															{movie.summary}
														</Well>
													</ListGroupItem>
												</ListGroup>
											);
										})
									: 'rien'}
							</Col>
						</Form>
					</Row>
				</Grid>;
	}
}

export default HomePage;
