import axios from 'axios';

export function resetFiltersUserChoiceInStore() {
	return (dispatch) => {
		dispatch({
			type: 'RESET_FILTERS_COLLECTION_STORE'
		});
	};
}

export function resetAllFilters() {
	return (dispatch) => {
		dispatch({
			type: 'RESET_FILTERS'
		});
	};
}

export function changeActualYear(yearRange) {
	return (dispatch) => {
		dispatch({
			type: 'CHANGE_YEAR_RANGE',
			yearRange: yearRange
		});
	};
}

export function changeActualNote(noteRange) {
	return (dispatch) => {
		dispatch({
			type: 'CHANGE_NOTE_RANGE',
			noteRange: noteRange
		});
	};
}

export function changeStatusNote(status) {
	return (dispatch) => {
		dispatch({
			type: 'CHANGE_STATUS_NOTE',
			status: status
		});
	};
}

export function changeStatusYear(status) {
	return (dispatch) => {
		dispatch({
			type: 'CHANGE_STATUS_YEAR',
			status: status
		});
	};
}

export function getAllGenresInStore(title) {
	return (dispatch) => {
		axios
			.post('/api/collection/getGenresInCollection/', { title: title })
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({
						type: 'GET_GENRES',
						payload: response.data.payload
					});
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}

export function getAllQualityInStore(title) {
	return (dispatch) => {
		axios
			.post('/api/collection/getQualityInCollection/', { title: title })
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({
						type: 'GET_QUALITY',
						payload: response.data.payload
					});
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}

export function getAllSeasonsInStore(title) {
	return (dispatch) => {
		axios
			.post('/api/collection/getSeasonsInCollection/', { title: title })
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({
						type: 'GET_SEASONS',
						payload: response.data.payload
					});
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}

export function getMinMaxImdbNote(title) {
	return (dispatch) => {
		axios
			.post('/api/collection/getMinMaxImdbNote/', { title: title })
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({
						type: 'GET_NOTES',
						payload: response.data.payload
					});
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}

export function getMinMaxYears(title) {
	return (dispatch) => {
		axios
			.post('/api/collection/getMinMaxYears/', { title: title })
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({
						type: 'GET_YEARS',
						payload: response.data.payload
					});
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}

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

export function getCollectionsByFilters(title, filters) {
	const request = { title: title, filters: filters };
	// debugger;
	return (dispatch) => {
		axios
			.post('/api/collection/getCollectionByTitleForClient/', request)
			.then((response) => {
				// debugger;
				if (response.data.status === 'success') {
					dispatch({
						type: 'FILTERS_UPDATE',
						filters: filters,
						json: response
					});
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

export function addOnePage() {
	return (dispach) => {
		dispach({
			type: 'PAGE_UPDATE'
		});
	};
}

export function getCollectionsListByName(requestTitle, page, requestAction, filters) {
	const request = { title: requestTitle, page: page, limit: 12, filters: filters };
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
			.get('/api/collection/getmoviedetails/' + idMovie)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({ type: 'GET_DETAIL_SUCCESS', payload: response.data });
				} else {
					dispatch({ type: 'GET_DETAIL_FAIL' });
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_COLLECTION_ERROR', payload: err });
			});
	};
}

export function getSubtitles(idMovie) {
	return (dispatch) => {
		axios
			.get('/api/torrent/subtitles/' + idMovie)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({ type: 'GET_SUBTITLES_SUCCESS', payload: response.data });
				} else {
					dispatch({ type: 'GET_SUBTITLES_FAIL' });
				}
			})
			.catch((err) => {
				dispatch({ type: 'GET_SUBTITLES_ERROR', payload: err });
			});
	};
}
