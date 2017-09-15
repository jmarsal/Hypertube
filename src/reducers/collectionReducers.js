export function collectionReducers(
	state = {
		collection: [],
		msg: '',
		style: '',
		page: 1,
		allGenres: [],
		allQuality: [],
		allSeasons: [],
		notesMinMax: [],
		notesMinMaxRange: [],
		noteActive: false,
		yearsMinMax: [],
		yearsMinMaxRange: [],
		yearActive: false
	},
	action
) {
	switch (action.type) {
		case 'GET_COLLECTION_BY_TITLE_SUCCESS':
		case 'FILTERS_UPDATE':
			return { ...state, collection: [ ...action.json.data.payload.docs ], page: 1 };

		case 'RESET_FILTERS_COLLECTION_STORE':
			return {
				...state,
				notesMinMaxRange: state.notesMinMax,
				noteActive: false,
				yearsMinMaxRange: state.yearsMinMax,
				yearActive: false
			};

		case 'CHANGE_YEAR_RANGE':
			return { ...state, yearsMinMaxRange: action.yearRange.yearRange };

		case 'CHANGE_NOTE_RANGE':
			return { ...state, notesMinMaxRange: action.noteRange.noteRange };

		case 'CHANGE_STATUS_NOTE':
			return { ...state, noteActive: action.status.noteActive };

		case 'CHANGE_STATUS_YEAR':
			return { ...state, yearActive: action.status.yearActive };

		case 'PAGE_UPDATE':
			return { ...state, page: state.page + 1 };

		case 'GET_GENRES':
			return { ...state, allGenres: action.payload };

		case 'GET_QUALITY':
			return { ...state, allQuality: action.payload };

		case 'GET_SEASONS':
			return { ...state, allSeasons: action.payload };

		case 'GET_NOTES':
			return { ...state, notesMinMax: action.payload, notesMinMaxRange: action.payload };

		case 'GET_YEARS':
			return { ...state, yearsMinMax: action.payload, yearsMinMaxRange: action.payload };

		case 'GET_COLLECTION_BY_TITLE_FAIL':
			return {
				...state,
				msg: 'There no result for this title...',
				style: 'warning'
			};

		case 'GET_COLLECTION_BY_SCROLL_SUCCESS':
			return {
				...state,
				collection: [ ...state.collection, ...action.json.data.payload.docs ],
				page: state.page
			};

		case 'GET_COLLECTION_ERROR':
			return {
				...state,
				msg: 'Error, please try again...',
				style: 'danger'
			};

		case 'GET_DETAIL_SUCCESS':
			return { ...state, movie: action.payload };

		case 'GET_SUBTITLES_SUCCESS':
			return { ...state, movie: action.payload };
	}
	return state;
}
