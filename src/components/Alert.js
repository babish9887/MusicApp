import React from 'react';
import './alert.css';
export default function Alert(props){
    return(
        props.alert && <div className="alert alert-warning" role="alert" >
            {props.alert.msg};
        </div>
    )
}