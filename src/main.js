import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Menu from './components/menu';
import Footer from './components/footer';

// LOCALISATION
import { IntlProvider, addLocaleData } from 'react-intl';
import fr from 'react-intl/locale-data/fr';
import en from 'react-intl/locale-data/en';
import localeData from '../localisation/locales/data.json';
addLocaleData([ ...en, ...fr ]);
let language = 'en';
//

class Main extends React.Component {
	render() {
		if (this.props.language) {
			language = this.props.language;
		} else if (this.props.user) {
			language = this.props.user.language;
		}
		const messages = localeData[language];

		return (
			<IntlProvider locale={language} messages={messages}>
				<div>
					<Menu />
					{this.props.children}
					<Footer />
				</div>
			</IntlProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.users.sessionUser,
		language: state.users.language
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
