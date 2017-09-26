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

// GET AN SPECIFIC USER BY ID
export function getOneUser(userID) {
	return (dispatch) => {
		axios
			.get('/api/users/one/' + userID)
			.then((response) => {
				dispatch({ type: 'GET_ONE_USER', payload: response.data });
			})
			.catch((err) => {
				dispatch({ type: 'GET_ONE_USER_REJECTED', payload: err });
			});
	};
}

// GET AN SPECIFIC USER BY LOGIN
export function getOneUserByLogin(userLogin) {
	return (dispatch) => {
		axios
			.get('/api/users/onebylogin/' + userLogin)
			.then((response) => {
				dispatch({ type: 'GET_ONE_USER', payload: response.data });
			})
			.catch((err) => {
				dispatch({ type: 'GET_ONE_USER_REJECTED', payload: err });
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
					const error = response.data.msg;
					dispatch({ type: 'LOGIN_USER_REJECTED', payload: error });
				}
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: 'LOGIN_USER_REJECTED', payload: 'Problem with authentification.' });
			});
	};
}

// SEND MAIL FORGET PASSWD OR LOGIN_USER
export function sendMailForgetIdConnect(emailUser) {
	return (dispatch) => {
		const email = { email: emailUser };

		axios.post('/api/users/forget', email).then((response) => {
			if (response.data.status === 'success') {
				dispatch({
					type: 'REINIT_ACCOUNT',
					payload: 'Check your mail !'
				});
			} else {
				dispatch({
					type: 'REINIT_ACCOUNT_FAIL',
					payload: 'There is no account for this email.'
				});
			}
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
					dispatch({
						type: 'ADD_USER',
						payload: 'response.data.content'
					});
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
export function updateUser(user, id) {
	return (dispatch) => {
		axios
			.put('/api/users/' + id, user)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({ type: 'UPDATE_USER', payload: response.data });
				} else {
					dispatch({ type: 'UPDATE_USER_REJECTED', payload: response.data.content });
				}
			})
			.catch((err) => {
				dispatch({
					type: 'UPDATE_USER_REJECTED',
					payload: [ { msg: 'There was an error while updating user.' } ]
				});
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

// UPDATE PASSWORD AFTER REINIT
export function updatePassword(user) {
	return (dispatch) => {
		axios
			.post('/api/users/reinitialisation', user)
			.then((response) => {
				if (response.data.status === 'success') {
					dispatch({ type: 'PASSWORD_RESET_SUCCESS' });
				} else {
					dispatch({ type: 'PASSWORD_RESET_FAILLURE' });
				}
			})
			.catch((err) => {
				dispatch({ type: 'PASSWORD_RESET_FAILLURE' });
			});
	};
}

// GET USER FROM SESSION
export function getUserFromSession() {
	return (dispatch) => {
		axios
			.get('/api/users/session')
			.then((response) => {
				dispatch({ type: 'GET_SESSION', payload: response.data });
			})
			.catch((err) => {
				dispatch({ type: 'GET_SESSION_REJECTED', msg: 'Error when get user from session.' });
			});
	};
}

// DISCONNECT USER
export function disconnectUser() {
	return (dispatch) => {
		axios
			.get('/api/users/disconnect')
			.then((response) => {
				dispatch({ type: 'USER_DISCONNECT' });
			})
			.catch((err) => {
				dispatch({ type: 'USER_DISCONNECT_REJECTED', msg: 'Error when user disconnected.' });
			});
	};
}

// SELECT BASIC AVATAR
export function selectBasicAvatar(avatar) {
	return (dispatch) => {
		if (avatar === '/avatars/croupier.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'croupier' });
		} else if (avatar === '/avatars/diver.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'diver' });
		} else if (avatar === '/avatars/doctor.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'doctor' });
		} else if (avatar === '/avatars/doctor2.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'doctor2' });
		} else if (avatar === '/avatars/farmer.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'farmer' });
		} else if (avatar === '/avatars/firefighter.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'firefighter' });
		} else if (avatar === '/avatars/man.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'man' });
		} else if (avatar === '/avatars/nun.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'nun' });
		} else if (avatar === '/avatars/showman.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'showman' });
		} else if (avatar === '/avatars/stewardess.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'stewardess' });
		} else if (avatar === '/avatars/welder.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'welder' });
		} else if (avatar === '/avatars/woman.png') {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'woman' });
		} else {
			dispatch({ type: 'SELECT_BASIC_AVATAR', payload: 'none' });
		}
	};
}

// CHANGE USER'S LANGUAGE
export function changeUserLanguage(language) {
	let data = new Object();
	data.language = language;
	return (dispatch) => {
		axios
			.post('/api/users/lang', data)
			.then((response) => {
				dispatch({ type: 'USER_LANGUAGE', payload: response.data });
			})
			.catch((err) => {
				dispatch({ type: 'USER_LANGUAGE_REJECTED' });
			});
	};
}
