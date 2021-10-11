import { useState } from "react"

type ValidationRuleType = {
    message?: string,
    validate: (value?: string) => boolean
}

type ReactiveFormValidatorType = {
    validate: (value: string, rules: ValidationRuleType[]) => {errors: string[], valid: boolean},

    // RULES
    required: (message?: string) => ValidationRuleType,
    email: (message?: string) => ValidationRuleType,
    minValue: (condition: number, message?: string) => ValidationRuleType,
    maxValue: (condition: number, message?: string) => ValidationRuleType,
    minCharacter: (condition: number, message?: string) => ValidationRuleType,
    maxCharacter: (condition: number, message?: string) => ValidationRuleType,
    pattern: (condition: any, message?: string) => ValidationRuleType,
}

const ReactiveFormValidator = ((): ReactiveFormValidatorType => {

    const required = (message?: string) => ({
        message: message || 'Required',
        validate: (value?: string) => !value ? false : true
    });

    const email = (message?: string) => ({
        message: message || 'Invalid Email',
        validate: (value?: string) => {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !value ? true : re.test(value)
        }
    });

    const minValue = (condition: number, message?: string) => ({
        message: message || `Minimum Value (${condition})`,
        condition,
        validate: (value?: string) => !value ? true : parseInt(value) >= condition
    });

    const maxValue = (condition: number, message?: string) => ({
        message: message || `Maximum Value (${condition})`,
        condition,
        validate: (value?: string) => !value ? true : parseInt(value) <= condition
    });
    
    const minCharacter = (condition: number, message?: string) => ({
        message: message || `Minimum Character (${condition})`,
        condition,
        validate: (value?: string) => !value ? true : value.length >= condition
    });

    const maxCharacter = (condition: number, message?: string) => ({
        message: message || `Maximum Character (${condition})`,
        condition,
        validate: (value?: string) => !value ? true : value.length <= condition
    });

    const pattern = (condition: any, message?: string) => ({
        message: message || `Invalid Pattern`,
        condition,
        validate: (value?: string) => !value ? true : condition.test(value)
    });

    const validate = (value: string, rules: ValidationRuleType[]) => {
        const errors: string[] = [];

        rules.forEach( v => {
            const invalid = !v.validate(value);
            if(invalid) {
                errors.push(v.message || '')
            }
        });

        return {
            valid: errors.length < 1,
            errors
        }
    }

    return {
        required,
        email,
        minValue,
        maxValue,
        minCharacter,
        maxCharacter,
        pattern,
        validate
    }
})()

type FormSchemaType = {
    [key: string]: {
        value: string,        
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
    addValidation: (to: string, validation: ValidationRuleType[]) => void
}

const useReactiveForm  = (
    schema: FormSchemaType,
    validator: ReactiveFormValidatorType
): hookType =>  {

        const [state, setState] = useState<FormSchemaType>(schema);

        const setValue = (key: string, value: string) => {
            setState( (prevState) => {
                return {
                    ...prevState,
                    [key]: {
                        ...prevState[key],
                        value: value
                    }
                }
            });
        }

        const getFormData = () => {
            const fields = Object.entries(state);

            let formData: FormData = {};
            let formValues = {}
            let isFormValid = true;

            fields.forEach( f => {
                const [key, field] = f;
                const value = state[key].value;

                const {errors, valid} = validator.validate(value, field?.validations || [])

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

        return {
            setValue,
            form: getFormData(),
            addValidation
        }
}

export default useReactiveForm;
export {
    ReactiveFormValidator
};