export function usersReducers(
	state = {
		users: []
	},
	action
) {
	switch (action.type) {
		case 'GET_USERS':
			return { ...state, users: [ ...action.payload ] };

		case 'ADD_USER':
			return {
				...state,
				users: [ ...state.users, ...action.payload ],
				msg: 'Success! Click to continue',
				style: 'success',
				validation: 'success'
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
			const currentUserToUpdate = [ ...state.users ];
			const indexToUpdate = currentUserToUpdate.findIndex((user) => {
				return user._id === action.payload._id;
			});
			return {
				users: [
					...currentUserToUpdate.slice(0, indexToUpdate),
					action.payload,
					...currentUserToUpdate.slice(indexToUpdate + 1)
				]
			};

		case 'LOGIN_USER':
			console.log('reducer');
			return {
				...state,
				users: [ ...action.payload ]
			};

		case 'LOGIN_USER_REJECTED':
			return {
				...state,
				msg: 'Please, try again',
				style: 'danger',
				validation: 'error',
				errors: action.payload
			};
	}
	return state;
}
