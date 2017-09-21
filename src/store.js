import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

//IMPORT COMBINED REDUCERS
import reducers from './reducers/index';

export default () => {
	// CREATE THE STORE
	const middleware = process.env.NODE_ENV === 'development' ? applyMiddleware(thunk, logger) : applyMiddleware(thunk);

	const store = createStore(
		reducers,
		compose(middleware, window.devToolsExtension ? window.devToolsExtension() : (f) => f)
	);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers/index.js', () => {
			const nextRootReducer = require('./reducers/index.js');
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
};
