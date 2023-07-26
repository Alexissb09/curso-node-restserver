import { validationResult } from "express-validator";

// Middleware para validar los campos
// Captura los errores, si no hay next

export const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors });
  }

  next(); // Luego de validar, continua con lo que tiene que hacer
};
