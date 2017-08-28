import axios from 'axios';

export function getComments(movieId) {
	return (dispatch) => {
		axios
			.get('/api/comments/' + movieId)
			.then((response) => {
				dispatch({
					type: 'GET_COMMENTS',
					payload: response.data
				});
			})
			.catch((err) => {
				dispatch({
					type: 'GET_COMMENTS_REJECTED',
					payload: [ { msg: 'There was an error while retrieving comments.' } ]
				});
			});
	};
}

export function addComment(commentData) {
	return (dispatch) => {
		axios
			.post('/api/comments', commentData)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({
						type: 'ADD_COMMENT',
						payload: response.data
					});
				} else {
					dispatch({ type: 'ADD_COMMENT_REJECTED', payload: response.data });
				}
			})
			.catch((err) => {
				dispatch({
					type: 'ADD_COMMENT_REJECTED',
					payload: [ { msg: 'There was an error while adding a new comment.' } ]
				});
			});
	};
}
