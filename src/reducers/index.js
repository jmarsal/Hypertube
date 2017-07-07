import { combineReducers } from 'redux';

//HERE IMPORT REDUCERS TO BE COMBINED
import { usersReducers } from './usersReducers';
import { uploadReducers } from './uploadReducers';

//HERE COMBINE THE REDUCERS
export default combineReducers({
	users: usersReducers,
	upload: uploadReducers
});
