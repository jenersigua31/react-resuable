import React, { SyntheticEvent } from 'react';
import useBEM from '../../hooks/useBEM';
import "./FormButton.scss"

interface Props {
    text: string,
    disabled?: boolean
    onClick?: () => void
}

const FormButton : React.FC<Props>  = ({
    text,
    disabled = false,
    onClick
}) =>  {
    // VARIABLES
    const [B, E] = useBEM('form-button');

    // HOOKS

    // METHODS
    const onClickHandler = (e: SyntheticEvent) => {
        e.preventDefault();
        if(onClick)onClick();
    }

    const classModifiers = () => {
        return [
            ...(disabled ? ['disabled'] : []),
        ]
    }

    return (
        <button disabled={disabled} className={B(classModifiers())} onClick={onClickHandler}>
            {text}
        </button>
    )
}

export default FormButton;