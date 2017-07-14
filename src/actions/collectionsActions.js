import axios from 'axios';

export function jsonFormatForClient(jsonArr) {
	return {
		type: 'GET_COLLECTION_BY_NAME_SUCCESS',
		json: jsonArr
	};
}

export function getCollectionsListByName(requestTitle, page) {
	const request = { title: requestTitle, page: page, limit: 10 };

	return (dispatch) => {
		axios
			.post('/api/collection/getCollectionByTitleForClient', request)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch(jsonFormatForClient(response));
				} else {
					dispatch({
						type: 'GET_COLLECTION_BY_NAME_FAIL'
					});
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}
