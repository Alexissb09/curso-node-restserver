import { response, request } from "express"; // Solo para que vscode sepa que es el res y req
import bcryptjs from "bcryptjs";

import { User } from "../models/user.js";

export const getUser = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const queryState = { state: true };

  // Promise.all ejecuta al mismo tiempo, es mas eficiente en tiempo de respuesta que hacer un await detras de otro
  // Devolvemos primero la cantidad de documentos y luego el objeto de usuarios
  // Si uno tiene un error, caen los demas

  const [total, users] = await Promise.all([
    User.countDocuments(queryState),
    User.find(queryState).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({ total, users });
};

export const postUser = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({
    name,
    email,
    password,
    role,
  });

  // Hash password
  const salt = bcryptjs.genSaltSync(); // 10
  user.password = bcryptjs.hashSync(password, salt);

  // SaveDB
  await user.save();

  res.json({ user });
};

export const putUser = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;

  if (password) {
    // Hash password
    const salt = bcryptjs.genSaltSync(); // 10
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(id, rest, { new: true });

  res.json({ updatedUser });
};

export const deleteUser = async (req, res = response) => {
  const { id } = req.params;

  // Logic delete
  const deletedUser = await User.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.status(200).json({ deletedUser });
};

export const patchUser = (req, res = response) => {
  res.status(200).json({
    ok: true,
    message: "patch API",
  });
};
