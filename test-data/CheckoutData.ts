export const ValidCheckoutData = {
    standardCustomer: {
        firstName: process.env.CHECKOUT_FIRST_NAME || "John",
        lastName: process.env.CHECKOUT_LAST_NAME || "Doe",
        postalCode: process.env.CHECKOUT_POSTAL_CODE || "12345"
    },

    alternativeCustomer: {
        firstName: process.env.CHECKOUT_ALT_FIRST_NAME || "Jane",
        lastName: process.env.CHECKOUT_ALT_LAST_NAME || "Smith",
        postalCode: process.env.CHECKOUT_ALT_POSTAL_CODE || "67890"
    },

    internationalCustomer: {
        firstName: process.env.CHECKOUT_INTL_FIRST_NAME || "Pierre",
        lastName: process.env.CHECKOUT_INTL_LAST_NAME || "Dubois",
        postalCode: process.env.CHECKOUT_INTL_POSTAL_CODE || "75001"
    },

    hyphenatedNames: {
        firstName: process.env.CHECKOUT_HYPHEN_FIRST || "Mary",
        lastName: process.env.CHECKOUT_HYPHEN_LAST || "Smith-Jones",
        postalCode: process.env.CHECKOUT_HYPHEN_ZIP || "12345-6789"
    }
};

export const InvalidCheckoutData = {
    emptyFirstName: {
        firstName: "",
        lastName: process.env.CHECKOUT_LAST_NAME || "Doe",
        postalCode: process.env.CHECKOUT_POSTAL_CODE || "12345",
        expectedError: "Error: First Name is required"
    },

    emptyLastName: {
        firstName: process.env.CHECKOUT_FIRST_NAME || "John",
        lastName: "",
        postalCode: process.env.CHECKOUT_POSTAL_CODE || "12345",
        expectedError: "Error: Last Name is required"
    },

    emptyPostalCode: {
        firstName: process.env.CHECKOUT_FIRST_NAME || "John",
        lastName: process.env.CHECKOUT_LAST_NAME || "Doe",
        postalCode: "",
        expectedError: "Error: Postal Code is required"
    },

    allFieldsEmpty: {
        firstName: "",
        lastName: "",
        postalCode: "",
        expectedError: "Error: First Name is required"
    },

    specialCharactersInName: {
        firstName: "John@123",
        lastName: "Doe#!$",
        postalCode: process.env.CHECKOUT_POSTAL_CODE || "12345"
    },

    veryLongFirstName: {
        firstName: "A".repeat(100),
        lastName: process.env.CHECKOUT_LAST_NAME || "Doe",
        postalCode: process.env.CHECKOUT_POSTAL_CODE || "12345"
    },

    veryLongLastName: {
        firstName: process.env.CHECKOUT_FIRST_NAME || "John",
        lastName: "B".repeat(100),
        postalCode: process.env.CHECKOUT_POSTAL_CODE || "12345"
    },

    numericPostalCode: {
        firstName: process.env.CHECKOUT_FIRST_NAME || "John",
        lastName: process.env.CHECKOUT_LAST_NAME || "Doe",
        postalCode: process.env.CHECKOUT_POSTAL_CODE || "12345"
    }
};

export const CheckoutExpectedValues = {
    itemTotal: "$39.98",
    tax: "$3.20",
    total: "$43.18",
    completeHeaderText: "Thank you for your order!"
};
