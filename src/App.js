import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import {store} from './index';
import Login from "./container/account/login/Login";
import Signup from "./container/account/signup/Signup";
import Dashboard from "./container/dashboard/home/Home";
import Header from "./components/app/header/Header";
import Footer from "./components/app/footer/Footer";
import ForgotPassword from "./container/account/forgotPassword/ForgotPassword";

function checkAuth() {
    const {auth} = store.getState().accountReducer;
    const {isAuthenticated} = auth;
    return isAuthenticated
}

export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => {
        return checkAuth() ?
            <Component {...props}/>
            : <Redirect to='/login'/>
    }
    }/>
);

export const ProtectedRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => {
        return checkAuth() ?
            <Redirect to='/dashboard'/>
            : <Component {...props}/>
    }}/>
);

export function BodyWrapper(props) {
    return (
        <div>
            <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                <Redirect from="*" to='/dashboard'/>
            </Switch>
        </div>
    )
}

class RouteComponent extends Component {
    render() {
        return (
            <div className="fill">
                <Header/>
                <Switch>
                    <ProtectedRoute path="/login" component={Login}/>
                    <ProtectedRoute path="/signup" component={Signup}/>
                    <ProtectedRoute path="/forgot-password" component={ForgotPassword}/>
                    <BodyWrapper props={this.props}/>
                </Switch>
                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {auth} = state.accountReducer;
    const {isAuthenticated} = auth;
    return {isAuthenticated}
}

export default withRouter(connect(mapStateToProps)(RouteComponent));
