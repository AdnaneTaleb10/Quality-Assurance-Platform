export const validateRegister = ({ name, email, role, password }) => {
  if (!name.trim())
    return "Full name is required";

  if (name.trim().length < 3)
    return "Name must be at least 3 characters";

  if (!email.trim())
    return "Email is required";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address";

  if (!role)
    return "Please select a role";

  if (!password)
    return "Password is required";

  if (password.length < 8)
    return "Password must be at least 8 characters";

  return null; 
};

export const validateLogin = ({ email, password }) => {
  if (!email.trim())
    return "Email is required";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address";

  if (!password)
    return "Password is required";

  return null;
};