import {combineReducers} from 'redux';

//HERE IMPORT REDUCERS TO BE COMBINED
import {usersReducers} from './usersReducers';

//HERE COMBINE THE REDUCERS
export default combineReducers({
    users: usersReducers,  
})