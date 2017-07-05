import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

//IMPORT COMBINED REDUCERS
import reducers from './reducers/index';

// CREATE THE STORE
const middleware = applyMiddleware(thunk, logger);
const store = createStore(
	/*reducers,*/ middleware,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

import HomePage from './components/pages/homePage';
import SubscribeForm from './components/pages/subscribeForm';
import Main from './main';

const Routes = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={HomePage} />
                <Route path="/login" />
                <Route path="/subscribe" component={SubscribeForm} />
            </Route>
        </Router>
    </Provider>
);

render(Routes, document.getElementById('app'));
