import axios from 'axios';

// GET USERS
export function getUsers() {
	return (dispatch) => {
		axios
			.get('/api/users')
			.then((response) => {
				dispatch({ type: 'GET_USERS', payload: response.data });
			})
			.catch((err) => {
				dispatch({ type: 'GET_USERS_REJECTED', payload: err });
			});
	};
}

// CHECK USER IN DB FOR CONNECTION
export function checkUserForConnect(user) {
	return (dispatch) => {
		axios
			.post('/api/users/login', user)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({ type: 'LOGIN_USER', payload: response.data.user });
				} else {
					const error = response.data.info.message;

					dispatch({ type: 'LOGIN_USER_REJECTED', payload: error });
				}
			})
			.catch(() => {
				dispatch({ type: 'LOGIN_USER_REJECTED', payload: 'problem with authentification' });
			});
	};
}

// ADD AN USER
export function addUser(user) {
	return (dispatch) => {
		axios
			.post('/api/users', user)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({ type: 'ADD_USER', payload: response.data.content });
				} else {
					dispatch({ type: 'ADD_USER_REJECTED', payload: response.data.content });
				}
			})
			.catch((err) => {
				dispatch({
					type: 'ADD_USER_REJECTED',
					payload: [ { msg: 'There was an error while adding a new user.' } ]
				});
			});
	};
}

// DELETE AN USER
export function deleteUser(id) {
	return (dispatch) => {
		axios
			.delete('/api/users/' + id)
			.then((response) => {
				dispatch({ type: 'DELETE_USER', payload: id });
			})
			.catch((err) => {
				dispatch({ type: 'DELETE_USER_REJECTED', payload: err });
			});
	};
}

// UPDATE AN USER
export function updateUser(user) {
	return (dispatch) => {
		axios
			.put('/api/users/' + id, user)
			.then((response) => {
				dispatch({ type: 'UPDATE_USER', payload: response.data });
			})
			.catch((err) => {
				dispatch({ type: 'UPDATE_USER_REJECTED', payload: err });
			});
	};
}

// ACCOUNT ACTIVATION
export function activateAccount(key, user) {
	return (dispatch) => {
		axios
			.get('/api/users/activation?key=' + key + '&user=' + user)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({ type: 'ACCOUNT_ACTIVATION' });
				} else {
					dispatch({ type: 'ACCOUNT_ACTIVATION_REJECTED' });
				}
			})
			.catch((err) => {
				dispatch({ type: 'ACCOUNT_ACTIVATION_REJECTED' });
			});
	};
}

// RESET FORM BUTTON
export function resetButton() {
	return {
		type: 'RESET_BUTTON'
	};
}
