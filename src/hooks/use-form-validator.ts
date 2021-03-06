import { useState } from "react"

type ValidationRequirement = {
    message?: string,
    validate: (value?: string) => boolean
}

type RequirementsSchema = { 
    [key: string] : ValidationRequirement[] | RequirementsSchema
};

type ValuesSchema = {
    [key: string]: string | {[key: string] : string}
}

type ValidationResult = {
    valid: boolean, 
    errors: string[]
}

export type FormValidator = {
    requirements?: RequirementsSchema,
    requirement: {
        required: (message?: string) => ValidationRequirement,
        email: (message?: string) => ValidationRequirement,
        minValue: (condition: number, message?: string) => ValidationRequirement,
        maxValue: (condition: number, message?: string) => ValidationRequirement,
        minCharacter: (condition: number, message?: string) => ValidationRequirement,
        maxCharacter: (condition: number, message?: string) => ValidationRequirement,
        pattern: (condition: any, message?: string) => ValidationRequirement,    
    },

    setRequirements: (reqs: RequirementsSchema) => void,
    addRequirements: (reqs: RequirementsSchema) => void,

    validateValue: (value: string, requirements: ValidationRequirement[]) => ValidationResult,
    validateValues: ( values: ValuesSchema ) => { 
        valid: boolean,
        result: { [key: string]: ValidationResult }
    } | undefined,    
}


const useFormValidator = (requirements?: RequirementsSchema): FormValidator => {
    
    const [ _requirements, _setRequirements ] = 
        useState<RequirementsSchema | undefined>(requirements);

    
    const validateValue = (value: string, requirements: ValidationRequirement[]) => {
        const errors: string[] = [];
        requirements.forEach( v => {
            const invalid = !v.validate(value);
            if(invalid) {
                errors.push(v.message || '')
            }
        });

        return {
            valid: errors.length < 1,
            errors,
        }
    }

    const validateValues = (values: ValuesSchema, requirements?: RequirementsSchema): {
        valid: boolean,
        result: {[key: string]: ValidationResult}
    } | undefined => {
        const requirementsSet = requirements || _requirements
        if(!requirementsSet)return undefined;

        let results = {}
        let validForm = true;

        const keyValues = Object.entries(values);
        keyValues.forEach( ([key, value]) => {                        
            //Nested
            if(typeof value === 'object' && value !== null){
                const result = validateValues(value, requirementsSet[key] as RequirementsSchema);
                if(result && !result.valid)validForm = false;                

                results = {
                    ...results,
                    [key]: result?.result
                }
            } else {
                const requirements = requirementsSet[key] as ValidationRequirement[];
                const result = requirements ? validateValue(value as string, requirements) : {valid: true};
                if(!result.valid)validForm = false;                

                results = {
                    ...results,
                    [key]: result
                }
            }
        })
        return {
            valid: validForm,
            result: results
        };
    }

    const requirement = {
        required : (message?: string) => ({
            message: message || 'Required',
            validate: (value?: string) => !value ? false : true
        }),    
        email : (message?: string) => ({
            message: message || 'Invalid Email',
            validate: (value?: string) => {
                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return !value ? true : re.test(value)
            }
        }),    
        minValue : (condition: number, message?: string) => ({
            message: message || `Minimum Value (${condition})`,
            condition,
            validate: (value?: string) => !value ? true : parseInt(value) >= condition
        }),    
        maxValue : (condition: number, message?: string) => ({
            message: message || `Maximum Value (${condition})`,
            condition,
            validate: (value?: string) => !value ? true : parseInt(value) <= condition
        }),        
        minCharacter : (condition: number, message?: string) => ({
            message: message || `Minimum Character (${condition})`,
            condition,
            validate: (value?: string) => !value ? true : value.length >= condition
        }),    
        maxCharacter : (condition: number, message?: string) => ({
            message: message || `Maximum Character (${condition})`,
            condition,
            validate: (value?: string) => !value ? true : value.length <= condition
        }),    
        pattern : (condition: any, message?: string) => ({
            message: message || `Invalid Pattern`,
            condition,
            validate: (value?: string) => !value ? true : condition.test(value)
        })
    }

    const setRequirements = (reqs: RequirementsSchema) => {
        _setRequirements(reqs);
    }

    const addRequirements = (reqs: RequirementsSchema) => {
        const copy = _requirements;

        const append = (oldRequirements:RequirementsSchema, toAppendRequirements: RequirementsSchema) => {
            const keyValues = Object.entries(toAppendRequirements);
            let newReqs = oldRequirements;
            keyValues.forEach( ([key, value]) => {
                if(Array.isArray(value)){                    
                    const currentRequirments = (oldRequirements && oldRequirements[key] ? oldRequirements[key] : []) as ValidationRequirement[];    
                    newReqs = {
                        ...newReqs,
                        [key]: [...currentRequirments, ...value]
                    }
                } else {
                    const currentRequirments = (oldRequirements && oldRequirements[key] ? oldRequirements[key] : {}) as RequirementsSchema;    
                    newReqs = {
                        ...newReqs,
                        [key]: append(currentRequirments, value)
                    }
                }
            });
            return newReqs;
        }

        if(copy){
            const newRequirements = append(copy, reqs);
            setRequirements(newRequirements)
        }
    }

    return {
        requirement,
        requirements: _requirements,

        setRequirements,
        validateValue,
        validateValues,
        addRequirements
    }
}

export default useFormValidator;