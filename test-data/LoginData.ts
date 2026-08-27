export const ValidLoginData = {
    standardUser: {
        username: process.env.STANDARD_USER || "standard_user",
        password: process.env.SHARED_PASSWORD || "secret_sauce"
    },

    problemUser: {
        username: process.env.PROBLEM_USER ||"problem_user",
        password: process.env.SHARED_PASSWORD || "secret_sauce",
    },

    performanceGlitchUser: {
        username: process.env.PERFORMANCE_GLITCH_USER || "performance_glitch_user",
        password: process.env.SHARED_PASSWORD || "secret_sauce"
    },

    errorUser: {
        username: process.env.ERROR_USER || "error_user",
        password: process.env.SHARED_PASSWORD || "secret_sauce"
    },

    visualUser: {
        username: process.env.VISUAL_USER || "visual_user",
        password: process.env.SHARED_PASSWORD || "secret_sauce"
    }

}

export const InvalidLoginData = {
    lockedOutUser: {
        username: process.env.LOCKED_OUT_USER || "locked_out_user",
        password: process.env.SHARED_PASSWORD || "secret_sauce",
        expectedError: "Epic sadface: Sorry, this user has been locked out."
    },

    wrongPassword: {
        username: process.env.STANDARD_USER || "standard_user",
        password: process.env.INVALID_PASSWORD || "invalidPassword",
        expectedError: "Epic sadface: Username and password do not match any user in this service"
    },

    emptyUsername: {
        username: "",
        password: process.env.SHARED_PASSWORD || "secret_sauce",
        expectedError: "Epic sadface: Username is required"
    },

    emptyPassword: {
        username: process.env.STANDARD_USER || "standard_user",
        password: "",
        expectedError: "Epic sadface: Password is required"
    }

}