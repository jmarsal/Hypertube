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
	Button,
	ListGroup,
	ListGroupItem,
	Label,
	Modal,
	OverlayTrigger,
	Popover,
	Tooltip
} from 'react-bootstrap';

import { addComment, getComments } from '../../actions/commentsActions';

class ModalUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: true
		};
	}

	componentDidMount() {
		this.setState({ showModal: true });
	}

	close() {
		console.log(this);
		this.setState({ showModal: false });
	}

	render() {
		const popover = (
			<Popover id="modal-popover" title="popover">
				very popover. such engagement
			</Popover>
		);
		const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

		return (
			<div>
				<Modal show={this.state.showModal} onHide={() => this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>Modal heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Text in a modal</h4>
						<p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

						<h4>Popover in a modal</h4>
						<p>there is a here</p>

						<h4>Tooltips in a modal</h4>
						<p>
							there is a{' '}
							<OverlayTrigger overlay={tooltip}>
								<a href="#">tooltip</a>
							</OverlayTrigger>{' '}
							here
						</p>

						<hr />

						<h4>Overflowing text to show scroll behavior</h4>
						<p>
							Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
							egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
						</p>
						<p>
							Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus
							vel augue laoreet rutrum faucibus dolor auctor.
						</p>
						<p>
							Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
							scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
							auctor fringilla.
						</p>
						<p>
							Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
							egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
						</p>
						<p>
							Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus
							vel augue laoreet rutrum faucibus dolor auctor.
						</p>
						<p>
							Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
							scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
							auctor fringilla.
						</p>
						<p>
							Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
							egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
						</p>
						<p>
							Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus
							vel augue laoreet rutrum faucibus dolor auctor.
						</p>
						<p>
							Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
							scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
							auctor fringilla.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

class MoviePage extends React.Component {
	constructor(props) {
		super(props);
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
		console.log('click');
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
				{this.state.currentProfilUser ? <ModalUser /> : null}
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.users.sessionUser,
		comments: state.comments.comments
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			addComment,
			getComments
		},
		dispatch
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviePage);
