import { body } from "express-validator";

const curpPattern = /^[A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;

function hasValidCurpDate(curp: string) {
  const year = Number(curp.slice(4, 6));
  const month = Number(curp.slice(6, 8));
  const day = Number(curp.slice(8, 10));
  const century = /\d/.test(curp[16]) ? 1900 : 2000;
  const date = new Date(Date.UTC(century + year, month - 1, day));

  return date.getUTCFullYear() === century + year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function hasValidCurpCheckDigit(curp: string) {
  const dictionary = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  const sum = curp.slice(0, 17).split("").reduce((total, character, index) => {
    return total + dictionary.indexOf(character) * (18 - index);
  }, 0);

  return (10 - (sum % 10)) % 10 === Number(curp[17]);
}

export const getUserValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email")
    .isLength({ max: 255 })
    .withMessage("Email must not be longer than 255")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8, max: 100 })
    .withMessage("La contraseña debe tener entre 8 y 100 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe incluir al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe incluir al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe incluir al menos un número"),
];

export const addUserValidator = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El apellido debe tener entre 2 y 100 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email")
    .isLength({ max: 255 })
    .withMessage("Email must not be longer than 255")
    .normalizeEmail(),

  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage("El teléfono no debe superar 20 caracteres")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage(
      "El teléfono solo puede contener números, espacios, +, -, ( y )",
    ),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8, max: 100 })
    .withMessage("La contraseña debe tener entre 8 y 100 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe incluir al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe incluir al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe incluir al menos un número"),

  body("birth_date")
    .notEmpty()
    .withMessage("La fecha de nacimiento es obligatoria")
    .isISO8601({ strict: true })
    .withMessage("La fecha de nacimiento debe tener formato YYYY-MM-DD")
    .custom((value: string) => {
      const birthDate = new Date(`${value}T00:00:00Z`);
      if (birthDate > new Date()) {
        throw new Error("La fecha de nacimiento no puede estar en el futuro");
      }
      return true;
    }),

  body("curp")
    .trim()
    .toUpperCase()
    .notEmpty()
    .withMessage("La CURP es obligatoria")
    .matches(curpPattern)
    .withMessage("La CURP no tiene un formato válido")
    .custom((value: string) => {
      if (!hasValidCurpDate(value)) {
        throw new Error("La fecha contenida en la CURP no es válida");
      }
      if (!hasValidCurpCheckDigit(value)) {
        throw new Error("El dígito verificador de la CURP no es válido");
      }
      return true;
    }),

  body("gender")
    .notEmpty()
    .withMessage("El género es obligatorio")
    .isIn(["male", "female", "other"])
    .withMessage("El género debe ser male, female u other"),

  body("accepts_communications")
    .optional()
    .isBoolean()
    .withMessage("El consentimiento de comunicaciones debe ser booleano")
    .toBoolean(),
];

export const verifyOtpValidator = [
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .matches(/^\d{6}$/)
    .withMessage("OTP must contain only numbers"),
];

export const changeMailOtpValidator = [
  ...getUserValidator,
  body("newEmail")
    .trim()
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email")
    .isLength({ max: 255 })
    .withMessage("Email must not be longer than 255")
    .normalizeEmail(),
];

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .matches(/^\d{6}$/)
    .withMessage("OTP must contain only numbers"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];