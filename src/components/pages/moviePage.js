import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Form, FormGroup, FormControl } from 'react-bootstrap';

import { addComment, getComments } from '../../actions/commentsActions';

class MoviePage extends React.Component {
	componentDidMount() {
		this.props.getComments(this.props.location.query.id);
	}

	handleChange(e) {
		let commentData = new Object();

		commentData.movieId = this.props.location.query.id;
		commentData.comment = e.target.value;
	}

	render() {
		const commentList = this.props.comments.map((comment) => {
			return (
				<Row key={comment.date}>
					{comment.username}: {comment.comment}
				</Row>
			);
		});

		return (
			<Grid>
				<Row>
					<Col smOffset={1} xs={11} md={11} lg={11}>
						<video
							width="800"
							height="600"
							//src={'/api/torrent/' + this.props.location.query.id}
							controls
							autoPlay
						>
							Your browser does not support the video tag.
						</video>
					</Col>
				</Row>
				<Row>
					<Col smOffset={1} xs={11} md={11} lg={11}>
						{commentList}
					</Col>
					<Col smOffset={1} xs={11} md={11} lg={11}>
						<Form horizontal>
							<FormGroup>
								<Col sm={10}>
									<FormControl
										type="text"
										placeholder="Ecrire un commentaire..."
										ref="commentary"
										onChange={(e) => this.handleChange(e)}
										autoFocus="true"
									/>
								</Col>
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
