/* SurveyField contains the logic to render a single lable and text input */
import React, { Component } from 'react';


export default ({ input, label }) => {

    return (
        <div>
            <label>{label}</label>
            <input {...input} />
        </div>
    );
}