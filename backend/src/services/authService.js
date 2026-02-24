import { createUser } from "../repositories/authRepository.js";
import { getUserByEmail } from "../repositories/authRepository.js"
import bcrypt from "bcrypt";

export const registerUserService = async(name, email, password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await createUser(name, email, hashedPassword);
    return result;
};

export const loginUserService = async (email, password) => {
    const user = await getUserByEmail(email);
    if(!user){
        const err = new Error("Invalid email or password");
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        const err = new Error("Invalid email or password");
        throw err;
    }

    return {
    id: user.id,
    email: user.email
    };
};
