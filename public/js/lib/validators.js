export const isValidPassword = (value) => {
  const errors = [];
  if (value && value.length) {
    !/[A-Z]/.test(value) && errors.push("Must contain capital letters");
    !/[a-z]/.test(value) && errors.push("Must contain lowercased letters");
    !/\d*/.test(value) && errors.push("Must contain number(s) value(s)");
    !/[^A-Za-z0-9]/.test(value) &&
      errors.push("Must contain special character(s) value(s)");
    value.length <= 6 &&
      errors.push("length must be greater or equal to 6 characters");
  } else {
    errors.push(`Password is required`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidEmail = (value) => {
  const errors = [];
  if (value && value.length) {
    !/^[a-z0-9]+@[a-z0-9]+\..{2,3}$/.test(value) &&
      errors.push("Must be a valid email");
  } else {
    errors.push(`Email is required`);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isSameAs = (value, refValue, refValueName) => {
  const errors = [];
  if (value !== refValue) {
    errors.push(`Must be same value as ${refValueName}.`);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidUsername = (value) => {
  const errors = [];
  if (value) {
    /\s/.test(value) &&
      errors.push("Username must only contains letters and/or numbers");
    value.length < 6 && errors.push("Must be at least 6 characters long.");
  } else {
    errors.push(`Username is required`);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isNotEmpty = (value) => {
  const errors = [];
  if (typeof value === "string") {
    value.length === 0 && errors.push("Value can't be empty");
  } else {
    !value && errors.push("Value can't be empty");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
