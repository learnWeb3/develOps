export const isValidPassword = (value) => {
  const errors = [];
  if (value && value.length) {
    !/A-Z/.test(value) && errors.push("Must contain capital letters");
    !/a-z/.test(value) && errors.push("Must contain lowercased letters");
    !/\d*/.test(value) && errors.push("Must contain number(s) value(s)");
    !/\s/.test(value) &&
      errors.push("Must contain special character(s) value(s)");
    value.length <= 6 &&
      errors.push("length must be greater or equal to 6 characters");
  } else {
    errors.push(`Email is required`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidEmail = (value) => {
  const errors = [];
  !(/^[a-z0-9]+@[a-z0-9]+\..{2,3}$/).test(value) &&
    errors.push("Must be a valid email");
  return {
    isValid: errors.length === 0,
    errors,
  };
};
