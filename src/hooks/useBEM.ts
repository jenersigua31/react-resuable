const modifierGenerator = (cls: string, modifier: string | string[]) => {
    const mods = Array.isArray(modifier) ? modifier : [modifier];
    return mods.map( m => `${cls}--${m}`).join(' ');
}

interface otherClass {
    modifier?: string | string[];
    def?: string
}

const classGenerator = (cls: string, others?: otherClass) => {
    const defaultClass = (others?.def || '');
    const mods = (others?.modifier && modifierGenerator(cls, others?.modifier)) || '';
    return `${defaultClass} ${cls} ${mods}`.trim();
}

const useBEM = (block: string, className?: string) => {

    const B = (modifier?: string | string[]) => {
        return classGenerator(block, {
            def: (className || ''),
            modifier
        });
    }

    const E = (element: string, modifier?: string | string[], def?: string) => {
        const BE = `${block.split(' ')[0]}__${element}`;
        return classGenerator(BE, {
            def: (def || ''),
            modifier
        });
    }

    return {
        B,
        E
    }
}

export {
    useBEM
};
