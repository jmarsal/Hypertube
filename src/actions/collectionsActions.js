import axios from 'axios';

export function jsonFormatForClient(jsonArr, requestAction) {
	return requestAction === 'scroll'
		? {
				type: 'GET_COLLECTION_BY_SCROLL_SUCCESS',
				json: jsonArr
			}
		: {
				type: 'GET_COLLECTION_BY_TITLE_SUCCESS',
				json: jsonArr
			};
}

export function getCollectionsListByName(requestTitle, page, requestAction) {
	const request = { title: requestTitle, page: page, limit: 10 };

	return (dispatch) => {
		axios
			.post('/api/collection/getCollectionByTitleForClient', request)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch(jsonFormatForClient(response, requestAction));
				} else {
					dispatch({
						type: 'GET_COLLECTION_BY_TITLE_FAIL'
					});
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}

export function getDetailMovie(idMovie) {
	return (dispatch) => {
		axios
			.get('/api/torrent/' + idMovie)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({ type: 'GET_DETAIL_SUCCESS' });
				} else {
					dispatch({ type: 'GET_DETAIL_FAIL' });
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}