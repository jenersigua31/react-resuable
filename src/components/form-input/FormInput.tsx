import React from 'react';
import useBEM from '../../hooks/useBEM';
import FormInputType from './FormInput.type';
import "./FormInput.scss";

interface Props {
    id?: string,
    type?: FormInputType,
    label?: string,
    value: string,
    placeholder?: string,
    layout?: 'horizontal' | 'vertical',
    onChange?: (value: string) => void,
}

const FormInput : React.FC<Props>  = ({
    id,
    type = FormInputType.TEXT,
    label,
    value,
    placeholder,
    layout = 'horizontal',

    onChange

}) =>  {
    // VARIABLES
    const [B, E] = useBEM('form-input');

    // METHODS
    const onChangeHandler = (e: any) => {
        if(onChange)onChange(e.target.value)
    }

    return (
        <div className={B(layout)}>            
            {
                label && 
                <label htmlFor={id} className={E('label')}>
                    { label }
                </label>
            }

            <input 
                type={type} id={id} 
                className={E('control', !label ? 'no-label': '')} 
                value={value} 
                placeholder={placeholder}

                onChange={onChangeHandler}/>
        </div>
    )
}

export default FormInput;