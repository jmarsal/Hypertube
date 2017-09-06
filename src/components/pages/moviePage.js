import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, ListGroup, ListGroupItem, Label } from 'react-bootstrap';
import ModalUser from 'components/modals/modalUser';

import { addComment, getComments } from '../../actions/commentsActions';

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
					<Label>{comment.username}</Label>
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
