import { response, request } from "express"; // Solo para que vscode sepa que es el res

export const getUser = (req = request, res = response) => {
  // query params
  const { q, name, page = "1" } = req.query;

  res.status(200).json({
    ok: true,
    message: "get API",
    name,
    q,
    page,
  });
};

export const putUser = (req = request, res = response) => {
  const { id } = req.params;

  console.log(req.params);

  res.status(500).json({
    ok: true,
    message: "get API",
    id,
  });
};

export const postUser = (req, res = response) => {
  const { name, age } = req.body;

  res.status(201).json({
    ok: true,
    message: "post API",
    name,
    age,
  });
};

export const deleteUser = (req, res = response) => {
  res.status(200).json({
    ok: true,
    message: "delete API",
  });
};

export const patchUser = (req, res = response) => {
  res.status(200).json({
    ok: true,
    message: "patch API",
  });
};
