export function collectionReducers(
	state = {
		collection: []
	},
	action
) {
	switch (action.type) {
		case 'GET_COLLECTION_BY_NAME_SUCCESS':
			return { ...state, collection: [ ...action.json.data.payload.docs ] };

		case 'GET_COLLECTION_BY_NAME_FAIL':
			return {
				...state,
				msg: 'There no result for this title...',
				style: 'warning'
			};

		case 'GET_COLLECTION_ERROR':
			return {
				...state,
				msg: 'Error, please try again...',
				style: 'danger'
			};
	}
	return state;
}
