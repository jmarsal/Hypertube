export function uploadReducers(
	state = {
		upload: []
	},
	action
) {
	switch (action.type) {
		case 'UPLOAD_DOCUMENT_SUCCESS':
			return { ...state, upload: [ ...action.payload ] };

		case 'UPLOAD_DOCUMENT_FAIL':
			return {
				...state,
				msg: 'Please, try again',
				style: 'danger',
				validation: 'error',
				errors: action.payload.data.content
			};
	}
	return state;
}
