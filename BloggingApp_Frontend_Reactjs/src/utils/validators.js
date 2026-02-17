export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // min 6 chars, at least 1 number
export const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
