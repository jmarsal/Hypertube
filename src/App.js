import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import createStore from './store';

// CREATE THE STORE
const store = createStore();

import HomePage from './components/pages/homePage';
import ActivationPage from './components/pages/activationPage';
import ReinitPage from './components/pages/forgetPasswdUsernamePage';
import MoviePage from './components/pages/moviePage';
import notFoundPage from './components/pages/notFoundPage';
import Main from './main';

class App extends Component {
	render() {
		return (
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
	}
}

export default App;
