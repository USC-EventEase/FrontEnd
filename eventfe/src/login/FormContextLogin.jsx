import React, { createContext, useState } from "react";

// Step 1: Create Context
export const FormContextLogin = createContext();

// Step 2: Create Provider
export const FormProviderLogin = ({ children }) => {
    const [formDataLogin, setFormDataLogin] = useState({
        email: '',
        password: ''
    });

    return (
        <FormContextLogin.Provider value={{ formDataLogin, setFormDataLogin }}>
            {children}
        </FormContextLogin.Provider>
    );
};
