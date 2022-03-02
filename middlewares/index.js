import { UnauthorizedError } from "../base/errors/index.js";
import { roles } from "../models/user.model.js";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function isLoggedIn(req, res, next) {
  if (req.session.currentUser) {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function isAdmin(req, res, next) {
  if (req.session.currentUser) {
    res.locals.isAdmin = req.session.currentUser.role === roles.admin;
  } else {
    res.locals.isAdmin = null;
  }
  next();
}
/**
 *
 * @param {*} unlessPaths
 * @returns
 */
export function authGuard(unlessPaths = []) {
  return function (req, res, next) {
    const { currentUser } = req.session;
    const match = unlessPaths.find(
      ({ path, method }) => path === req.url && method === req.method
    );
    if (!match) {
      if (currentUser) {
        next();
      } else {
        throw new UnauthorizedError(
          "You must be logged in to access this ressource"
        );
      }
    }
    next();
  };
}

/**
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export function errorHandler(err, req, res, next) {
  if (err) {
    const errorType = err.constructor.name;
    const errorMessage = err.message;
    const { path } = req;
    const isApplicationJson =
      req.headers["content-type"] === "application/json";
    switch (errorType) {
      case "ForbiddenError":
        res.status(403);
        if (isApplicationJson) {
          res.json({
            status: "error",
            statusCode: 403,
            statusMessage: "Forbidden",
            message: errorMessage,
            path,
          });
        } else {
          res.render("errors/index", {
            statusCode: 403,
            statusMessage: "Forbidden",
            message: errorMessage,
          });
        }
        return;
      case "UnauthorizedError":
        res.status(401);
        if (isApplicationJson) {
          res.json({
            status: "error",
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: errorMessage,
            path,
          });
        } else {
          res.render("errors/index", {
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: errorMessage,
          });
        }
        return;
      case "NotFoundError":
        res.status(400);
        if (isApplicationJson) {
          res.json({
            status: "error",
            statusCode: 404,
            statusMessage: "Not found !",
            message: errorMessage,
            path,
          });
        } else {
          res.render("errors/index", {
            statusCode: 404,
            statusMessage: "Not found !",
            message: errorMessage,
          });
        }
        return;
      case "BadRequestError":
        res.status(400);
        if (isApplicationJson) {
          res.json({
            status: "error",
            statusCode: 400,
            statusMessage: "Bad request",
            message: errorMessage,
            path,
          });
        } else {
          res.render("errors/index", {
            statusCode: 400,
            statusMessage: "Bad request",
            message: errorMessage,
          });
        }
        return;
      default:
        break;
    }

    res.status(500);
    if (isApplicationJson) {
      res.json({
        status: "error",
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: errorMessage,
        path,
      });
    } else {
      res.render("errors/index", {
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: errorMessage,
      });
    }
    return;
  } else {
    next();
  }
}
