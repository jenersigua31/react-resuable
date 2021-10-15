import { useState } from "react"

type ValidationRuleType = {
    message?: string,
    validate: (value?: string) => boolean
}

type FormSchemaType = {
    [key: string]: {
        value: string,        
        dirty?:boolean,
        default?: string,
        label?: string,
        validations?: ValidationRuleType[]
    }
}

type FormData = {    
    [key: string]: {
        valid: boolean,
        errors: string[],
        value: string,
    },
    valid?: any,
    data?: any,
}

type hookType = {
    setValue: (key: string, value: string) => void,
    form: FormData,
    addValidation: (to: string, validation: ValidationRuleType[]) => void,
    reset: () => void,
    clear: () => void
}


type ValidationResult = {
    valid: boolean, 
    errors: string[]
}

type ValidationRequirement = {
    message?: string,
    validate: (value?: string) => boolean
}

const useReactiveForm  = (
    schema: FormSchemaType,
    validator: (value: string, requirements: ValidationRequirement[]) => ValidationResult,
): hookType =>  {

        const [state, setState] = useState<FormSchemaType>(schema);

        

        const getFormData = () => {
            const fields = Object.entries(state);

            let formData: FormData = {};
            let formValues = {}
            let isFormValid = true;

            fields.forEach( f => {
                const [key, field] = f;
                const value = state[key].value;

                const {errors, valid} = state[key].dirty ? 
                    validator(value, field?.validations || []) :
                    {
                        errors:[],
                        valid: true
                    }

                if(!valid)isFormValid = false;

                formValues = {
                    ...formValues,
                    [key]: value
                }

                formData = {
                    ...formData,
                    [key]: {
                        errors,
                        value,
                        valid
                    }
                }                
            })

            formData.data = formValues;
            formData.valid = isFormValid;

            return formData
        }

        const addValidation = (to: string, validation: ValidationRuleType[]) => {
            setState( (prevState) => {
                return {
                    ...prevState,
                    [to]: {
                        ...prevState[to],
                        validations: [
                            ...(prevState[to].validations || []),
                            ...validation
                        ]
                    }
                }
            });
        }

        const reset = () => {
            Object.entries(state).forEach( ([key, values]) => {                
                updateValue(key, values.default || '')       
            });
        }

        const clear = () => {
            Object.entries(state).forEach( ([key, values]) => {                
                updateValue(key, '')       
            });
        }

        const updateValue = (key: string, value: string, dirty: boolean = false) => {
            setState( (prevState) => {
                return {
                    ...prevState,
                    [key]: {
                        ...prevState[key],
                        value: value,
                        dirty
                    }
                }
            }); 
        }

        const setValue = (key: string, value: string) => {
            updateValue(key, value, true)       
        }

        return {
            setValue,
            form: getFormData(),
            addValidation,
            reset,
            clear
        }
}

export default useReactiveForm;