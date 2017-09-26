import React from 'react';
import validator from 'validator';
import path from 'path';
import {
	Panel,
	Col,
	Image,
	Button,
	Form,
	FormControl,
	FormGroup,
	ButtonToolbar,
	ControlLabel,
	Alert
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { getOneUser, resetButton, selectBasicAvatar, updateUser } from '../../actions/usersActions';
import { uploadDocumentRequest } from '../../actions/uploadActions';

class ProfilPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			updated: false,
			sendOn: false,
			sizeError: '',
			username: '',
			password: '',
			email: '',
			img: '',
			imgObj: {},
			newImagename: '',
			firstname: '',
			lastname: '',
			emailCheck: 'warning',
			usernameCheck: 'warning',
			passwordCheck: 'warning',
			imgCheck: 'warning',
			firstnameCheck: 'warning',
			lastnameCheck: 'warning'
		};
	}

	componentDidMount() {
		this.props.getOneUser(this.props.sessionUser._id);
		this.setState({ modif: false });
	}

	handleChange(e) {
		const { selectBasicAvatar } = this.props;
		const inputId = e.target.id,
			val = e.target.value;

		if (inputId === 'username') {
			if (val.length > 2 && val.length < 15) {
				this.setState({ usernameCheck: 'success' });
			} else {
				this.setState({ usernameCheck: 'warning' });
			}
			this.setState({ username: val });
		}
		if (inputId === 'firstname') {
			if (val.length > 1 && val.length < 50) {
				this.setState({ firstnameCheck: 'success' });
			} else {
				this.setState({ firstnameCheck: 'warning' });
			}
			this.setState({ firstname: val });
		}
		if (inputId === 'lastname') {
			if (val.length > 2 && val.length < 50) {
				this.setState({ lastnameCheck: 'success' });
			} else {
				this.setState({ lastnameCheck: 'warning' });
			}
			this.setState({ lastname: val });
		}
		if (inputId === 'email') {
			if (validator.isEmail(val)) {
				this.setState({ emailCheck: 'success' });
			} else {
				this.setState({ emailCheck: 'warning' });
			}
			this.setState({ email: val });
		}
		if (inputId === 'password') {
			this.setState({ password: val });
			if (val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')) {
				this.setState({ passwordCheck: 'success' });
			} else {
				this.setState({ passwordCheck: 'warning' });
			}
		}
		if (inputId === 'avatar') {
			if (validator.matches(val, /.(gif|jpg|jpeg|png)$/, 'i') && e.target.files[0]) {
				if (e.target.files[0].size > 5000000) {
					this.setState({ sizeError: 'Avatar: File too big.', imgCheck: 'error' });
				} else if (e.target.files[0].size < 100) {
					this.setState({ sizeError: 'Avatar: File too small.', imgCheck: 'error' });
				} else {
					this.setState({
						newImagename: '_' + Date.now() + '_profil' + path.extname(e.target.files[0].name)
					});
					this.setState({ imgObj: e.target.files[0], imgCheck: 'success', img: val });
					selectBasicAvatar('none');
				}
			} else {
				this.setState({ sizeError: 'Avatar: Files accepted are .gif, .jpg, .jpeg, .png.', imgCheck: 'error' });
			}
		} else {
			this.setState.img = '';
		}
	}

	selectAvatar(avatar) {
		const { selectBasicAvatar } = this.props;

		selectBasicAvatar(avatar);
		this.setState({ img: avatar, imgCheck: 'success' });
	}

	submitForm() {
		const user = {
				username: this.state.username,
				email: this.state.email,
				password: this.state.password === '' ? null : this.state.password,
				img: this.state.img === '' ? this.props.profilUser.data.img : this.state.img,
				firstname: this.state.firstname,
				lastname: this.state.lastname
			},
			file = this.state.imgObj;
		if (this.state.img.search('/avatars/') > 0 && this.state.imgCheck === 'success') {
			this.props.uploadDocumentRequest({
				file,
				name: this.state.newImagename
			});
		}

		this.props.updateUser(user, this.props.sessionUser._id);
		this.setState({ updated: true });
	}

	componentDidUpdate() {
		const { updateSuccess, showModal } = this.props;

		if (this.props.profilUser) {
			this.state.username === '' && this.props.profilUser.data.username !== ''
				? this.setState({ username: this.props.profilUser.data.username, usernameCheck: 'success' })
				: null;
			this.state.firstname === '' && this.props.profilUser.data.firstname !== ''
				? this.setState({ firstname: this.props.profilUser.data.firstname, firstnameCheck: 'success' })
				: null;
			this.state.lastname === '' && this.props.profilUser.data.lastname !== ''
				? this.setState({ lastname: this.props.profilUser.data.lastname, lastnameCheck: 'success' })
				: null;
			this.state.email === '' && this.props.profilUser.data.email !== ''
				? this.setState({ email: this.props.profilUser.data.email, emailCheck: 'success' })
				: null;
		}

		if (
			this.state.sendOn == false &&
			this.state.usernameCheck === 'success' &&
			this.state.emailCheck === 'success' &&
			this.state.firstnameCheck === 'success' &&
			this.state.lastnameCheck === 'success'
		) {
			this.setState({ sendOn: true });
		} else if (
			this.state.sendOn == true &&
			(this.state.usernameCheck !== 'success' ||
				this.state.emailCheck !== 'success' ||
				this.state.firstnameCheck !== 'success' ||
				this.state.lastnameCheck !== 'success')
		) {
			this.setState({ sendOn: false });
		}

		if (updateSuccess && this.state.updated == true) {
			this.setState({ updated: false });
			setTimeout(function() {
				showModal(false);
			}, 1000);
		}
	}

	modifProfil() {
		const { changeTitle } = this.props;

		changeTitle(<FormattedMessage id="edit_profil" />);
		this.setState({ modif: true });
	}

	getBack() {
		return this.setState({ modif: false });
	}

	render() {
		if (this.props.profilUser && this.props.sessionUser) {
			const { showModal, updateSuccess } = this.props;

			let image = this.props.profilUser.data.img;
			let style = {
				backgroundImage: 'url(' + image + ')'
			};

			return this.state.modif == false ? (
				<Panel>
					<Col smPush={9} sm={4}>
						<Button onClick={() => this.modifProfil()}>
							<FormattedMessage id="edit_profil" />
						</Button>
					</Col>
					<Col smOffset={7} smPull={5} sm={8}>
						<div className="profilImage" style={style} />
					</Col>
					<Col smOffset={4} sm={4}>
						<h4>{this.props.profilUser.data.firstname + ' ' + this.props.profilUser.data.lastname}</h4>
					</Col>
					<Col smOffset={4} sm={4}>
						<h5>{this.props.profilUser.data.username}</h5>
					</Col>
				</Panel>
			) : (
				<Form horizontal>
					<FormGroup>
						<Col sm={10}>
							{this.props.errorsUsers ? (
								this.props.errorsUsers.map((errorsArr, i) => {
									return (
										<Alert key={i} bsStyle="warning">
											{errorsArr.msg}
										</Alert>
									);
								})
							) : (
								''
							)}
							{this.props.errorsUpload ? (
								this.props.errorsUpload.map((errorsArr, i) => {
									return (
										<Alert key={i} bsStyle="warning">
											{errorsArr.msg}
										</Alert>
									);
								})
							) : (
								''
							)}
							{this.state.sizeError ? (
								<Alert key="sizeError" bsStyle="warning">
									{this.state.sizeError}
								</Alert>
							) : (
								''
							)}
						</Col>
					</FormGroup>

					<FormGroup controlId="firstname" validationState={this.state.firstnameCheck}>
						<Col componentClass={ControlLabel} sm={2}>
							<FormattedMessage id="firstname" />
						</Col>
						<Col sm={10}>
							<FormControl
								type="text"
								placeholder="Enter your firstname"
								ref="firstname"
								value={this.state.firstname}
								onChange={(e) => this.handleChange(e)}
							/>
						</Col>
					</FormGroup>

					<FormGroup controlId="lastname" validationState={this.state.lastnameCheck}>
						<Col componentClass={ControlLabel} sm={2}>
							<FormattedMessage id="lastname" />
						</Col>
						<Col sm={10}>
							<FormControl
								type="text"
								placeholder="Enter your lastname"
								ref="lastname"
								value={this.state.lastname}
								onChange={(e) => this.handleChange(e)}
							/>
						</Col>
					</FormGroup>

					<FormGroup controlId="email" validationState={this.state.emailCheck}>
						<Col componentClass={ControlLabel} sm={2}>
							Email
						</Col>
						<Col sm={10}>
							<FormControl
								type="email"
								placeholder="Enter your email"
								ref="email"
								value={this.state.email}
								onChange={(e) => this.handleChange(e)}
							/>
						</Col>
					</FormGroup>

					<FormGroup controlId="password" validationState={this.state.passwordCheck}>
						<Col componentClass={ControlLabel} sm={2}>
							<FormattedMessage id="password" />
						</Col>
						<Col sm={10}>
							<FormControl
								type="password"
								placeholder="Enter your password"
								ref="password"
								onChange={(e) => this.handleChange(e)}
							/>
						</Col>
					</FormGroup>

					<FormGroup controlId="avatar" validationState={this.state.imgCheck}>
						<Col componentClass={ControlLabel} sm={2}>
							Avatar
						</Col>
						<Col sm={10}>
							<h5>
								<FormattedMessage id="avatar_upload" />
							</h5>
							<FormControl type="file" onChange={(e) => this.handleChange(e)} />
						</Col>
						<Col sm={10}>
							<Col smOffset={2} sm={10}>
								<h5>
									<FormattedMessage id="avatar_choose" />
								</h5>
							</Col>
							<Col smOffset={2} sm={12}>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'croupier' ? (
												'logoOauth croupier active'
											) : (
												'logoOauth croupier'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/croupier.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'diver' ? (
												'logoOauth diver active'
											) : (
												'logoOauth diver'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/diver.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'doctor' ? (
												'logoOauth doctor active'
											) : (
												'logoOauth doctor'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/doctor.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'doctor2' ? (
												'logoOauth doctor2 active'
											) : (
												'logoOauth doctor2'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/doctor2.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'farmer' ? (
												'logoOauth farmer active'
											) : (
												'logoOauth farmer'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/farmer.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'firefighter' ? (
												'logoOauth firefighter active'
											) : (
												'logoOauth firefighter'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/firefighter.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'man' ? (
												'logoOauth man active'
											) : (
												'logoOauth man'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/man.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'nun' ? (
												'logoOauth nun active'
											) : (
												'logoOauth nun'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/nun.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'showman' ? (
												'logoOauth showman active'
											) : (
												'logoOauth showman'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/showman.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'stewardess' ? (
												'logoOauth stewardess active'
											) : (
												'logoOauth stewardess'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/stewardess.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'welder' ? (
												'logoOauth welder active'
											) : (
												'logoOauth welder'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/welder.png')}
									/>
								</Col>
								<Col xs={3}>
									<div
										className={
											this.props.classActive && this.props.classActive === 'woman' ? (
												'logoOauth woman active'
											) : (
												'logoOauth woman'
											)
										}
										onClick={(avatar) => this.selectAvatar('/avatars/woman.png')}
									/>
								</Col>
							</Col>
						</Col>
					</FormGroup>

					<FormGroup>
						<Col sm={10}>
							<ButtonToolbar>
								<Button type="button" onClick={() => this.getBack()}>
									<FormattedMessage id="back" />
								</Button>
								<Button
									bsStyle="primary"
									type="button"
									disabled={!this.state.sendOn}
									onClick={() => this.submitForm()}
								>
									<FormattedMessage id="submit" />
								</Button>
							</ButtonToolbar>
						</Col>
					</FormGroup>
				</Form>
			);
		} else {
			return null;
		}
	}
}

function mapStateToProps(state) {
	return {
		sessionUser: state.users.sessionUser,
		profilUser: state.users.user,
		users: state.users.users,
		upload: state.upload,
		msg: state.users.msg,
		style: state.users.style,
		validation: state.users.validation,
		errorsUsers: state.users.errors,
		errorsUpload: state.upload.errors,
		classActive: state.users.classActive,
		updateSuccess: state.users.updateSuccess
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getOneUser,
			resetButton,
			selectBasicAvatar,
			uploadDocumentRequest,
			updateUser
		},
		dispatch
	);
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfilPage));
