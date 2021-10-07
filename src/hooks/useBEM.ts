type bemType = [
    B: (modifierName?: string | string[]) => string,
    E: (elementName: string, modifiers?: string | string[]) => string,
]

const useBEM  = (blockName: string): bemType =>  {

        const E = (elementName: string, modifiers?: string | string[]): string => {

            let modifier = '';
            if (modifiers) {
                modifier = `${blockName}__${elementName}--${modifiers}`;
                if(Array.isArray(modifiers)){
                    modifier = modifiers.map( m => m ? `${blockName}__${elementName}--${m}` : '').join(' ');
                }
            }

            return `${blockName}__${elementName} ${modifier}`.trim();
        }

        const B = (modifiers?: string | string[]): string => {         
            
            let modifier = '';
            if (modifiers) {
                modifier = `${blockName}--${modifiers}`;
                if (Array.isArray(modifiers)) {
                    modifier = modifiers.map( m => m ? `${blockName}--${m}` : '').join(' ');
                }
            }
            
            return `${blockName} ${modifier}`.trim();
        }

        return [
            B,
            E
        ]
}

export default useBEM;