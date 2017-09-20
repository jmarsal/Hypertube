import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Grid,
	Row,
	Col,
	Panel,
	Form,
	FormGroup,
	FormControl,
	Button,
	ButtonGroup,
	Image,
	ListGroup,
	ListGroupItem,
	Label,
	Modal,
	Jumbotron
} from 'react-bootstrap';
import validator from 'validator';
import { FormattedMessage, injectIntl } from 'react-intl';

import { addComment, getComments } from '../../actions/commentsActions';
import { getOneUserByLogin } from '../../actions/usersActions';
import { getDetailMovie, getSubtitles } from '../../actions/collectionsActions';
class ModalUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: true
		};
	}

	componentWillReceiveProps(nextProps) {
		nextProps.show === true ? this.setState({ showModal: true }) : null;
	}

	close() {
		this.setState({ showModal: false });
		this.props.handlerClose();
	}

	render() {
		let image = this.props.img;
		let style = {
			backgroundImage: 'url(' + image + ')'
		};

		return (
			<div>
				<Modal show={this.state.showModal} onHide={() => this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>{this.props.username}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Panel>
							<Col smOffset={7} smPull={5} sm={8}>
								<div className="profilImage" style={style} />
							</Col>
							<Col smOffset={4} sm={4}>
								<h4>{this.props.firstname + ' ' + this.props.lastname}</h4>
							</Col>
						</Panel>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.close()}>
							<FormattedMessage id="close" />
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

class MoviePage extends React.Component {
	constructor(props) {
		super(props);

		this.handlerClose = this.handlerClose.bind(this);

		this.state = {
			comment: '',
			currentQuality: '720p'
		};
	}

	componentDidMount() {
		this.props.getComments(this.props.location.query.id);
		this.props.getDetailMovie(this.props.location.query.id);
		this.props.getSubtitles(this.props.location.query.id);
	}

	handleChange(e) {
		const inputId = e.target.id,
			val = e.target.value;

		if (inputId === 'comment') {
			this.setState({ comment: val });
		}
	}

	handleQuality(quality) {
		this.setState({ currentQuality: quality });
	}

	handleClickOnUser(user) {
		this.setState({ currentProfilUser: user });
		this.props.getOneUserByLogin(user);
	}

	handlerClose() {
		this.setState({ currentProfilUser: undefined });
	}

	submitForm() {
		if (this.state.comment !== '') {
			let commentData = new Object();

			commentData.movieId = this.props.location.query.id;
			commentData.comment = validator.escape(this.state.comment).trim();
			commentData.username = this.props.user.username;

			this.props.addComment(commentData);
			document.getElementById('commentForm').reset();
			this.setState({ comment: '' });
		}
	}

	render() {
		const { intl } = this.props;

		const commentList = this.props.comments.map((comment) => {
			return (
				<ListGroupItem key={comment.date}>
					<Label className="commentUsername" onClick={() => this.handleClickOnUser(comment.username)}>
						{comment.username}
					</Label>
					{' ' + comment.comment}
				</ListGroupItem>
			);
		});

		const seasonEpisode = () => {
			if (this.props.movie.data.season && this.props.movie.data.episode) {
				return (
					<div>
						<Row>
							<b>
								<FormattedMessage id="season_player" />
							</b>{' '}
							{this.props.movie.data.season}
						</Row>
						<Row>
							<b>
								<FormattedMessage id="episode_player" />
							</b>{' '}
							{this.props.movie.data.episode}
						</Row>
					</div>
				);
			} else {
				return null;
			}
		};

		const qualityMenu = () => {
			if (this.props.movie && this.props.movie.data && this.props.movie.data.torrent.length > 1) {
				return (
					<ButtonGroup className="qualitySelection">
						{this.props.movie.data.torrent.map((torrent) => {
							return (
								<Button
									bsStyle={this.state.currentQuality === torrent.quality ? 'primary' : 'default'}
									key={torrent.quality}
									onClick={() => this.handleQuality(torrent.quality)}
								>
									{torrent.quality}
								</Button>
							);
						})}
					</ButtonGroup>
				);
			}
		};

		if (this.props.movie && this.props.user) {
			let image = this.props.movie.data.background;
			let styleBackground = {
				position: 'absolute',
				zIndex: '-100',
				left: '0',
				width: '100%',
				height: '400px',
				backgroundImage: 'url(' + image + ')',
				backgroundPosition: 'center top',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				opacity: '0.5'
			};

			return (
				<Grid>
					<div className="backgroundImage" style={styleBackground} />
					<Panel className="panelMovie">
						<Row>
							<Col>
								<h3>{this.props.movie.data.title}</h3>
							</Col>
						</Row>
						<br />
						<Row>
							<Col xs={12} md={12}>
								<Col xs={12} md={4}>
									<Image src={this.props.movie.data.cover} responsive thumbnail />
								</Col>
								<Col xs={12} md={8}>
									<Row>
										<b>
											<FormattedMessage id="year_player" />
										</b>{' '}
										{this.props.movie.data.year ? (
											this.props.movie.data.year
										) : (
											<i>
												<FormattedMessage id="available_player" />
											</i>
										)}
									</Row>
									<Row>
										<b>
											<FormattedMessage id="country_player" />
										</b>{' '}
										{this.props.movie.data.country ? (
											this.props.movie.data.country
										) : (
											<i>
												<FormattedMessage id="available_player" />
											</i>
										)}
									</Row>
									{seasonEpisode()}
									<Row>
										<b>
											<FormattedMessage id="duration_player" />
										</b>{' '}
										{this.props.movie.data.runtime ? (
											this.props.movie.data.runtime + ' min'
										) : (
											<i>
												<FormattedMessage id="available_player" />
											</i>
										)}
									</Row>
									<Row>
										<b>
											<FormattedMessage id="rating_player" />
										</b>{' '}
										{this.props.movie.data.rating ? (
											this.props.movie.data.rating + '/10'
										) : (
											<i>
												<FormattedMessage id="available_player" />
											</i>
										)}
									</Row>
									<Row>
										<b>
											<FormattedMessage id="producer_player" />
										</b>{' '}
										{this.props.movie.data.producer ? (
											this.props.movie.data.producer
										) : (
											<i>
												<FormattedMessage id="available_player" />
											</i>
										)}
									</Row>
									<Row>
										<b>
											<FormattedMessage id="director_player" />
										</b>{' '}
										{this.props.movie.data.director ? (
											this.props.movie.data.director
										) : (
											<i>
												<FormattedMessage id="available_player" />
											</i>
										)}
									</Row>
									<Row>
										<b>Casting:</b>{' '}
										{this.props.movie.data.actors ? (
											this.props.movie.data.actors
										) : (
											<i>
												<FormattedMessage id="available_player" />
											</i>
										)}
									</Row>
									<br />
									<Row>
										<b>Synopsis:</b>{' '}
										{this.props.movie.data.summary ? (
											this.props.movie.data.summary
										) : (
											<i>
												<FormattedMessage id="available_player" />
											</i>
										)}
									</Row>
								</Col>
							</Col>
						</Row>
						<br />
						<Row>
							<Col xs={12} md={12}>
								<Jumbotron>
									<div className="video-div">
										<video
											className="videoInsert"
											src={
												'/api/torrent/' +
												this.props.location.query.id +
												'/' +
												this.state.currentQuality
											}
											preload="none"
											controls
											autoPlay
										>
											{this.props.movie.data.subtitleEn ? (
												<track
													src={'subtitles' + this.props.movie.data.subtitleEn}
													kind="subtitles"
													srcLang="en"
													label="English"
												/>
											) : null}
											{this.props.movie.data.subtitleFr ? (
												<track
													src={'subtitles' + this.props.movie.data.subtitleFr}
													kind="subtitles"
													srcLang="fr"
													label="French"
												/>
											) : null}
											Your browser does not support the video tag.
										</video>
									</div>
									{qualityMenu()}
								</Jumbotron>
							</Col>
						</Row>
						<br />
					</Panel>

					<br />
					<Panel>
						<Row>
							<Col>
								<ListGroup>{commentList}</ListGroup>
							</Col>
							<Col>
								<Form
									id="commentForm"
									onSubmit={(e) => {
										e.preventDefault();
									}}
								>
									<FormGroup controlId="comment">
										<Col md={12} mdOffset={1}>
											<Col md={8}>
												<FormControl
													type="text"
													placeholder={intl.formatMessage({ id: 'comment_bar' })}
													ref="comment"
													onChange={(e) => this.handleChange(e)}
												/>
											</Col>
											<Col md={4}>
												<Button
													bsStyle="primary"
													type="button"
													onClick={() => this.submitForm()}
												>
													<FormattedMessage id="submit" />
												</Button>
											</Col>
										</Col>
									</FormGroup>
								</Form>
							</Col>
						</Row>
					</Panel>
					{this.state.currentProfilUser && this.props.profilUser ? (
						<ModalUser
							show={true}
							user={this.state.currentProfilUser}
							firstname={this.props.profilUser.data.firstname}
							lastname={this.props.profilUser.data.lastname}
							username={this.props.profilUser.data.username}
							img={this.props.profilUser.data.img}
							handlerClose={this.handlerClose}
						/>
					) : null}
				</Grid>
			);
		} else {
			return null;
		}
	}
}

function mapStateToProps(state) {
	return {
		user: state.users.sessionUser,
		profilUser: state.users.user,
		comments: state.comments.comments,
		movie: state.collection.movie
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			addComment,
			getComments,
			getOneUserByLogin,
			getDetailMovie,
			getSubtitles
		},
		dispatch
	);
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MoviePage));
