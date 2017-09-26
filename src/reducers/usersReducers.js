export function usersReducers(
	state = {
		users: []
	},
	action
) {
	switch (action.type) {
		case 'GET_USERS':
			return { ...state, users: [ ...action.payload ] };

		case 'GET_ONE_USER':
			return { ...state, user: action.payload };

		case 'GET_ONE_USER_REJECTED':
			return { ...state, msg: action.payload };

		case 'ADD_USER':
			return {
				...state,
				users: [ ...state.users, ...action.payload ],
				msg: 'Success! Click to continue',
				style: 'success',
				validation: 'success',
				messSuccess: 'Welcome to Hypertube '
			};

		case 'ADD_USER_REJECTED':
			return { ...state, msg: 'Please, try again', style: 'danger', validation: 'error', errors: action.payload };

		case 'RESET_BUTTON':
			return { ...state, msg: null, style: 'primary', validation: null, errors: null };

		case 'DELETE_USER':
			const currentUserToDelete = [ ...state.users ];
			const indexToDelete = currentUserToDelete.findIndex((user) => {
				return user._id.toString() === action.payload;
			});
			return {
				users: [
					...currentUserToDelete.slice(0, indexToDelete),
					...currentUserToDelete.slice(indexToDelete + 1)
				]
			};

		case 'UPDATE_USER':
			return {
				...state,
				sessionUser: action.payload.user,
				updateSuccess: true
			};

		case 'UPDATE_USER_REJECTED':
			return {
				...state,
				msg: 'Please, try again',
				style: 'danger',
				validation: 'error',
				errors: action.payload
			};

		case 'LOGIN_USER':
			return {
				...state,
				sessionUser: action.payload
			};

		case 'LOGIN_USER_REJECTED':
			return { ...state, style: 'danger', info: action.payload };

		case 'GET_SESSION':
			return {
				...state,
				sessionUser: action.payload
			};

		case 'GET_SESSION_REJECTED':
			return { ...state, style: 'danger', info: action.msg };

		case 'USER_DISCONNECT':
			return {
				...state,
				sessionUser: null
			};

		case 'USER_DISCONNECT_REJECTED':
			return { ...state };

		case 'ACCOUNT_ACTIVATION':
			return {
				...state,
				activation: true
			};

		case 'ACCOUNT_ACTIVATION_REJECTED':
			return {
				...state,
				activation: false
			};

		case 'REINIT_ACCOUNT':
			return {
				...state,
				validMail: true,
				mess: action.payload
			};

		case 'REINIT_ACCOUNT_FAIL':
			return {
				...state,
				validMail: false,
				mess: action.payload
			};

		case 'PASSWORD_RESET_SUCCESS':
			return {
				...state,
				successUpdatePasswd: true,
				mess: 'password reset successful'
			};

		case 'PASSWORD_RESET_FAILLURE':
			return {
				...state,
				successUpdatePasswd: false,
				mess: 'password reset faillure'
			};

		case 'SELECT_BASIC_AVATAR':
			return {
				...state,
				classActive: action.payload
			};

		case 'USER_LANGUAGE':
			return {
				...state,
				language: action.payload.content
			};

		case 'USER_LANGUAGE_REJECTED':
			return {
				...state
			};
	}
	return state;
}
