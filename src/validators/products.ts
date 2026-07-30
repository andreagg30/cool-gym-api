import { body, param } from "express-validator";

const productIdBodyValidator = body("productId")
  .trim()
  .notEmpty()
  .withMessage("El productId es obligatorio")
  .isLength({ max: 50 })
  .withMessage("El productId no debe superar 50 caracteres");

const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("El nombre es obligatorio")
  .isLength({ max: 50 })
  .withMessage("El nombre no debe superar 50 caracteres");

const descriptionValidator = body("description")
  .isString()
  .withMessage("La descripción debe ser texto")
  .notEmpty()
  .withMessage("La descripción es obligatoria");

const expirationDateValidator = body("expiration_date")
  .notEmpty()
  .withMessage("La fecha de expiración es obligatoria")
  .isISO8601({ strict: true })
  .withMessage("La fecha de expiración debe tener formato YYYY-MM-DD");

export const createProductValidator = [
  nameValidator,
  descriptionValidator,
  expirationDateValidator,
  productIdBodyValidator,
];

export const productIdParamValidator = [
  param("productId")
    .trim()
    .notEmpty()
    .withMessage("El productId es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El productId no debe superar 50 caracteres"),
];

export const updateProductValidator = [
  body().custom((value: Record<string, unknown>) => {
    const editableFields = [
      "name",
      "description",
      "expiration_date",
      "productId",
    ];
    if (!editableFields.some((field) => value[field] !== undefined)) {
      throw new Error("Debes enviar al menos un campo para actualizar");
    }
    return true;
  }),
  nameValidator.optional(),
  descriptionValidator.optional(),
  expirationDateValidator.optional(),
  productIdBodyValidator.optional(),
];
