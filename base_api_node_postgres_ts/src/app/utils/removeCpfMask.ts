export default (cpf: string): string | undefined => {
    if (typeof cpf !== 'string') return undefined;
    // Remove all non-digit characters
    return cpf.replace(/[^\d]/g, '');
};

