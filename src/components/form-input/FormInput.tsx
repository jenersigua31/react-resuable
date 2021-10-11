import React, { useEffect, useRef, useState } from 'react';
import useBEM from '../../hooks/useBEM';
import "./FormInput.scss";

type InputType = 'text' 
    | 'email' 
    | 'password'
    | 'date'
    | 'number'

type LayoutType =  'horizontal' | 'vertical';

interface Props {
    id?: string,
    type?: InputType,
    label?: string,
    value: string,
    placeholder?: string,
    layout?: LayoutType,
    submitted?: boolean,
    valid?: boolean,
    errorMessage?: string, 
    labelWidth?: string,

    onChange?: (value: string) => void,
}

const FormInput : React.FC<Props>  = ({
    id,
    type = 'text',
    label,
    value,
    placeholder,
    layout = 'horizontal',
    submitted,
    valid,
    errorMessage,
    labelWidth,
    onChange

}) =>  {
    // VARIABLES
    const [B, E] = useBEM('form-input');
    const [touched, setTouched] = useState(false);
    const [dirty, setDirty] = useState(false);

    // METHODS
    const onChangeHandler = (e: any) => {
        if(onChange)onChange(e.target.value)
    }

    const onBlurHandler = () => {
        setTouched(true);
    }

    const onKeyDownHandler = () => {
        setDirty(true);
    }

    const isInvalid = () => {
        return !valid && (touched || dirty || submitted) 
    }

    const classModifiers = () => {
        return [
            layout,
            ...(touched ? ['touched'] : []),
            ...(dirty ? ['dirty'] : []),

            ...(isInvalid() ? ['invalid'] : []),
        ]
    }

    return (
        <div className={B(classModifiers())}>   

            <div className={E('text')}>
                { label && 
                    <label htmlFor={id} className={E('label')} style={{
                        minWidth: labelWidth
                    }}>
                        { label }
                    </label>
                }

                { isInvalid() && <span className={E('error-message')}>{errorMessage}</span> }                
            </div>         

            <input 
                type={type} id={id} 
                className={E('control', !label ? 'no-label': '')} 
                value={value} 
                placeholder={placeholder}

                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                onKeyDown={onKeyDownHandler}    
            />
        </div>
    )
}

export default FormInput;