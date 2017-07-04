import React from 'react';
import {Popover, OverlayTrigger, MenuItem, InputGroup, DropdownButton, Image, Col, Row, Well, Panel, FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {findDOMNode} from 'react-dom';
import {addUser, resetButton} from '../../actions/usersActions';
import axios from 'axios';

class SubscribeForm extends React.Component {

    handleSubmit() {
        const user = [{
            login: findDOMNode(this.refs.login).value,
            email: findDOMNode(this.refs.email).value,
            password: findDOMNode(this.refs.password).value,
            //img: findDOMNode(this.refs.image).value,
            firstname: findDOMNode(this.refs.firstname).value,
            lastname: findDOMNode(this.refs.lastname).value,
        }];
        
        if (user[0].login === '') {
            this.refs.emptyLogin.show();
        } else if (user[0].firstname === '') {
            this.refs.emptyFirstname.show();
        } else if (user[0].lastname === '') {
            this.refs.emptyLastname.show();
        } else if (user[0].email === '') {
            this.refs.emptyEmail.show();
        } else if (user[0].password === '') {
            this.refs.emptyPassword.show();
        } else {
            this.props.addUser(user);
        }
    }

    resetForm() {
        this.props.resetButton();
        findDOMNode(this.refs.login).value = '';
        findDOMNode(this.refs.email).value = '';
        findDOMNode(this.refs.password).value = '';
        findDOMNode(this.refs.firstname).value = '';
        findDOMNode(this.refs.lastname).value = '';
    }

    render() {
        
        return(
            <Well>
                <Row>
                    <Col xs={12} sm={6}>
                        <Panel>

                            <OverlayTrigger ref="emptyLogin" placement="right" overlay={
                                <Popover id="popover-positioned-right">
                                    Please enter your login.
                                </Popover>
                            }>
                                <FormGroup controlId="login" validationState={this.props.validation}>
                                    <ControlLabel>Login</ControlLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="Enter your login"
                                        ref="login"
                                    />
                                    <FormControl.Feedback />
                                </FormGroup>
                            </OverlayTrigger>

                            <OverlayTrigger ref="emptyFirstname" placement="right" overlay={
                                <Popover id="popover-positioned-right">
                                    Please enter your firstname.
                                </Popover>
                            }>
                                <FormGroup controlId="firstname" validationState={this.props.validation}>
                                    <ControlLabel>Firstname</ControlLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="Enter your firstname"
                                        ref="firstname"
                                    />
                                    <FormControl.Feedback />
                                </FormGroup>
                            </OverlayTrigger>

                            <OverlayTrigger ref="emptyLastname" placement="right" overlay={
                                <Popover id="popover-positioned-right">
                                    Please enter your lastname.
                                </Popover>
                            }>
                                <FormGroup controlId="lastname" validationState={this.props.validation}>
                                    <ControlLabel>Lastname</ControlLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="Enter your lastname"
                                        ref="lastname"
                                    />
                                    <FormControl.Feedback />
                                </FormGroup>
                            </OverlayTrigger>

                            <OverlayTrigger ref="emptyEmail" placement="right" overlay={
                                <Popover id="popover-positioned-right">
                                    Please enter your email.
                                </Popover>
                            }>
                                <FormGroup controlId="email" validationState={this.props.validation}>
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl
                                        type="email"
                                        placeholder="Enter your email"
                                        ref="email"
                                    />
                                    <FormControl.Feedback />
                                </FormGroup>
                            </OverlayTrigger>

                            <OverlayTrigger ref="emptyPassword" placement="right" overlay={
                                <Popover id="popover-positioned-right">
                                    Please enter your password.
                                </Popover>
                            }>
                                <FormGroup controlId="password" validationState={this.props.validation}>
                                    <ControlLabel>Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        placeholder="Enter your password"
                                        ref="password"
                                    />
                                    <FormControl.Feedback />
                                </FormGroup>
                            </OverlayTrigger>

                            <Button
                                onClick={(!this.props.msg)?(this.handleSubmit.bind(this)):(this.resetForm.bind(this))}
                                bsStyle={(!this.props.style)?("primary"):(this.props.style)}>
                                {(!this.props.msg)?("Sign in"):(this.props.msg)}
                            </Button>

                        </Panel>
                    </Col>
                </Row>
            </Well>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users.users,
        msg: state.users.msg,
        style: state.users.style,
        validation: state.users.validation
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addUser,
        resetButton
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeForm);