import { combineReducers } from 'redux';

//HERE IMPORT REDUCERS TO BE COMBINED
import { usersReducers } from './usersReducers';
import { uploadReducers } from './uploadReducers';
import { collectionReducers } from './collectionReducers';
import { commentsReducers } from './commentsReducers';

//HERE COMBINE THE REDUCERS
export default combineReducers({
	users: usersReducers,
	upload: uploadReducers,
	collection: collectionReducers,
	comments: commentsReducers
});
