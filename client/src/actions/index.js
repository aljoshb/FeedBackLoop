import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');

    /* The server returns the update user model, so dispatch it to re-render components that use it*/
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async dispatch => {
    const res = await axios.post('/api/stripe', token);

    /* The server returns the update user model, so dispatch it to re-render components that use it*/
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
    const res = await axios.post('/api/surveys', values);

    history.push('/surveys');
    
    /* The server returns the update user model, so dispatch it to re-render components that use it*/
    dispatch({ type: FETCH_USER, payload: res.data });
};