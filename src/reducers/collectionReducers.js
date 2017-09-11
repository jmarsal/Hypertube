export function collectionReducers(
	state = {
		collection: []
	},
	action
) {
	switch (action.type) {
		case 'GET_COLLECTION_BY_TITLE_SUCCESS':
			return { ...state, collection: [ ...action.json.data.payload.docs ] };

		case 'GET_COLLECTION_BY_TITLE_FAIL':
			return {
				...state,
				msg: 'There no result for this title...',
				style: 'warning'
			};

		case 'GET_COLLECTION_BY_SCROLL_SUCCESS':
			let newCollection = [];

			if (state.collection.length) {
				newCollection.push.apply(newCollection, state.collection);
				newCollection.push.apply(newCollection, action.json.data.payload.docs);
			} else {
				newCollection = action.json.data.payload.docs;
			}
			return { ...state, collection: [ ...newCollection ] };

		case 'GET_COLLECTION_ERROR':
			return {
				...state,
				msg: 'Error, please try again...',
				style: 'danger'
			};

		case 'GET_DETAIL_SUCCESS':
			return { ...state, movie: action.payload };
	}
	return state;
}
