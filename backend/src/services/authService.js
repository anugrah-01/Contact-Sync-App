import { createUser } from "../repositories/authRepository.js";

export const registerUserService = async(name, email, password) => {
    const result = await createUser(name, email, password);
    return result;
};