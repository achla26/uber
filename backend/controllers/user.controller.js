import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { createUser } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname || {};

    // Validate fullname
    if (!firstname || !lastname) {
        throw new ApiError(400, "Full name must include first and last name.");
    }

    // Create the user using the service
    const newUser = await createUser(firstname, lastname, email, password);

    // Generate token if the user model supports it
    const token = newUser.generateAuthToken
        ? newUser.generateAuthToken()
        : null; // Ensure generateAuthToken exists on the model

    // Send response
    return res
        .status(201)
        .json(
            new ApiResponse(201, { user: newUser, token }, "User registered successfully.")
        );
});
