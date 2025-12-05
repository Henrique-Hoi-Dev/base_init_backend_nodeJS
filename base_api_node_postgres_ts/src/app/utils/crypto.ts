import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const authenticatePassword = (plainTextPassword: string, encryptedPassword: string): boolean =>
    bcrypt.compareSync(plainTextPassword, encryptedPassword);

export const encryptPassword = (password: string): string => bcrypt.hashSync(password, 10);

/**
 * Gera um código com um número específico de dígitos.
 *
 * Essa função utiliza o módulo 'crypto' para gerar valores aleatórios e, em seguida,
 * combina esses valores para criar um código. Se a saída exceder o número de dígitos
 * especificado, o código será truncado para se ajustar ao tamanho desejado.
 *
 * @function
 * @param {number} [numberOfDigits=5] - O número de dígitos que o código gerado deve ter. O valor padrão é 5.
 * @returns {string} Um código aleatório com o número especificado de dígitos.
 *
 * @example
 * // Retorna um código com 5 dígitos (por padrão)
 * const requestCode = generateNumericCode();
 *
 * @example
 * // Retorna um código com 8 dígitos
 * const requestCode = generateNumericCode(8);
 */
export const generateNumericCode = (numberOfDigits: number = 5): string => {
    const min = Math.pow(10, numberOfDigits - 1);
    const max = Math.pow(10, numberOfDigits) - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString().slice(0, numberOfDigits);
};

export const generateRandomCode = (size: number = 3): string =>
    crypto.randomBytes(size).toString('hex').toUpperCase();

