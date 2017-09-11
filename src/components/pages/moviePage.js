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
	ListGroup,
	ListGroupItem,
	Label,
	Modal
} from 'react-bootstrap';

import { addComment, getComments } from '../../actions/commentsActions';
import { getOneUserByLogin } from '../../actions/usersActions';

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
						<Button onClick={() => this.close()}>Close</Button>
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
			comment: ''
		};
	}

	componentDidMount() {
		this.props.getComments(this.props.location.query.id);
	}

	handleChange(e) {
		const inputId = e.target.id,
			val = e.target.value;

		if (inputId === 'comment') {
			this.setState({ comment: val });
		}
	}

	handleClickOnUser(user) {
		this.setState({ currentProfilUser: user });
		console.log(user);
		this.props.getOneUserByLogin(user);
	}

	handlerClose() {
		this.setState({ currentProfilUser: undefined });
	}

	submitForm() {
		let commentData = new Object();

		commentData.movieId = this.props.location.query.id;
		commentData.comment = this.state.comment;
		commentData.username = this.props.user.username;

		this.props.addComment(commentData);
		document.getElementById('commentForm').reset();
	}

	render() {
		const commentList = this.props.comments.map((comment) => {
			return (
				<ListGroupItem key={comment.date}>
					<Label onClick={() => this.handleClickOnUser(comment.username)}>{comment.username}</Label>
					{comment.comment}
				</ListGroupItem>
			);
		});

		return (
			<Grid>
				<Row>
					<Col smOffset={1} xs={11} md={11} lg={11}>
						<video
							width="800"
							height="600"
							src={'/api/torrent/' + this.props.location.query.id}
							preload="none"
							controls
							autoPlay
						>
							Your browser does not support the video tag.
						</video>
					</Col>
				</Row>
				<br />
				<Row>
					<Col smOffset={1} xs={11} md={11} lg={11}>
						<ListGroup>{commentList}</ListGroup>
					</Col>
					<Col smOffset={1} xs={11} md={11} lg={11}>
						<Form
							id="commentForm"
							onSubmit={(e) => {
								e.preventDefault();
							}}
						>
							<FormGroup controlId="comment">
								<Col sm={10}>
									<FormControl
										type="text"
										placeholder="Write a comment..."
										ref="comment"
										onChange={(e) => this.handleChange(e)}
									/>
								</Col>
								<Button bsStyle="primary" type="button" onClick={() => this.submitForm()}>
									Submit
								</Button>
							</FormGroup>
						</Form>
					</Col>
				</Row>
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
	}
}

function mapStateToProps(state) {
	return {
		user: state.users.sessionUser,
		profilUser: state.users.user,
		comments: state.comments.comments
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			addComment,
			getComments,
			getOneUserByLogin
		},
		dispatch
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviePage);
