import axios from 'axios';

export function uploadSuccess({ data }) {
	return {
		type: 'UPLOAD_DOCUMENT_SUCCESS',
		payload: data
	};
}

export function uploadFail(error) {
	return {
		type: 'UPLOAD_DOCUMENT_FAIL',
		payload: error
	};
}

export function uploadDocumentRequest({ file, name }) {
	let data = new FormData();
	data.append('name', name);
	data.append('file', file);

	return (dispatch) => {
		axios
			.post('/api/users/upload', data)
			.then((response) => {
				if (response.status === 'success') {
					dispatch(uploadSuccess(response));
				} else {
					dispatch(uploadFail(response));
				}
			})
			.catch((error) => {
				dispatch(uploadFail(error));
			});
	};
}
