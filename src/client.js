import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { applyMiddleware, createStore, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

//IMPORT COMBINED REDUCERS
import reducers from './reducers/index';

// CREATE THE STORE
const middleware = applyMiddleware(thunk, logger);
const store = createStore(
	reducers,
	compose(middleware, window.devToolsExtension ? window.devToolsExtension() : (f) => f)
);

import HomePage from './components/pages/homePage';
import ActivationPage from './components/pages/activationPage';
import ReinitPage from './components/pages/forgetPasswdUsernamePage';
import MoviePage from './components/pages/moviePage';
import notFoundPage from './components/pages/notFoundPage';
import Main from './main';

const Routes = (
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={Main}>
				<IndexRoute component={HomePage} />
				<Route path="/activation" component={ActivationPage} />
				<Route path="/reinitialisation" component={ReinitPage} />
				<Route path="/movie" component={MoviePage} />
				<Route path="*" exact={true} component={notFoundPage} />
			</Route>
		</Router>
	</Provider>
);

render(Routes, document.getElementById('app'));
