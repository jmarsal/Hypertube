export function filtersReducers(state = {}, action) {
	switch (action.type) {
		case 'FILTERS_UPDATE':
			return { ...state, ...action.filters };

		case 'RESET_FILTERS':
			return (state = {});

		default:
			return state;
	}
}
