import React, { createContext, useState } from "react";

// Step 1: Create Context
export const FormContextSignup = createContext();

// Step 2: Create Provider
export const FormProviderSignup = ({ children }) => {
    const [formDataSignup, setFormDataSignup] = useState({
        name: '',
        email: '',
        password: '',
        type: ''
    });

    return (
        <FormContextSignup.Provider value={{ formDataSignup, setFormDataSignup }}>
            {children}
        </FormContextSignup.Provider>
    );
};
