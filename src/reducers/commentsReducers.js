export function commentsReducers(
	state = {
		comments: []
	},
	action
) {
	switch (action.type) {
		case 'GET_COMMENTS':
			return {
				...state,
				comments: action.payload.content
			};

		case 'GET_COMMENTS_REJECTED':
			return {
				...state,
				msg: 'Error while retrieving comments',
				style: 'danger',
				validation: 'error',
				errors: action.payload
			};

		case 'ADD_COMMENT':
			return {
				...state,
				comments: action.payload
			};

		case 'ADD_COMMENT_REJECTED':
			return { ...state, msg: 'Please, try again', style: 'danger', validation: 'error', errors: action.payload };
	}
	return state;
}
