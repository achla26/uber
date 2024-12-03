import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createUser = async (firstname, lastname, email, password) => {
    try {
        if ([firstname, lastname, email, password].some((field) => !field?.trim())) {
            throw new ApiError(400, "All fields are required.");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError(409, "User with this email already exists.");
        }

        // Hash password
        // const hashedPassword = await User.hashedPassword(password); 

        // Create new user
        const user = await User.create({
            fullname: { firstname, lastname },
            email,
            password,
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "Error while fetching created user.");
        }

        return createdUser;
    } catch (error) {
        // Re-throw the error to let the controller handle it
        throw error; 
    }
};

export const signIn = async (email, password) => {
    try {
        if ([email, password].some((field) => !field?.trim())) {
            throw new ApiError(400, "All fields are required.");
        }

        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            throw new ApiError(400, "User does not exist.")
        } 

        const isPasswordValid = await user.comparePassword(password);
    
        if(!isPasswordValid){
            throw new ApiError(401 , "Invalid User Credentials.");
        }          

        return user;
    } catch (error) {
        // Re-throw the error to let the controller handle it
        throw error; 
    }
};
