import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form'; // Yes the name 'reducer' is confusing. That's how redux-form saved it, so we used a more understandable name called 'reduxForm'
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';

export default combineReducers({
    auth: authReducer,
    form: reduxForm,
    surveys: surveysReducer
});