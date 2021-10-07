import React, { SyntheticEvent } from 'react';
import useBEM from '../../hooks/useBEM';
import "./FormButton.scss"

interface Props {
    text: string,
    onClick?: () => void
}

const FormButton : React.FC<Props>  = ({
    text,
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

    return (
        <button className={B()} onClick={onClickHandler}>
            {text}
        </button>
    )
}

export default FormButton;