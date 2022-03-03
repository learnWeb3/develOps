import { UnauthorizedError } from "../base/errors/index.js";
import { roles } from "../models/user.model.js";

export function flashAlert(sessionKey) {
  return function (req, res, next) {
    if (req.session && req.session[sessionKey]) {
      res.locals[sessionKey] = req.session[sessionKey];
      delete req.session[sessionKey];
    } else {
      res.locals[sessionKey] = {
        message: null,
        type: null,
      };
    }
    next();
  };
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function isLoggedIn(req, res, next) {
  if (req.session.currentUser) {
    res.locals.isLoggedIn = true;
    res.locals.currentUser = req.session.currentUser;
  } else {
    res.locals.isLoggedIn = false;
    res.locals.currentUser = null;
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
  if (req.session.role) {
    res.locals.isAdmin = req.session.role === roles.admin;
  } else {
    res.locals.isAdmin = false;
  }
  next();
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function adminGuard(protectedPaths = []) {
  return function (req, res, next) {
    const isProtectedPath = protectedPaths.find(({ match, method }) => {
      const regex = new RegExp(match);
      // console.log(regex.test(req.url))
      return req.method === method && regex.test(req.url);
    });
    if (isProtectedPath) {
      if (req.session && req.session.role !== undefined) {
        if (req.session.role === roles.admin) {
          next();
        } else {
          next(
            new UnauthorizedError(
              `You do not have the rights to perform this action`
            )
          );
        }
      } else {
        next(
          new UnauthorizedError(
            `You must be logged in in order to perform this action.`
          )
        );
      }
    } else {
      next();
    }
  };
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
        next(
          new UnauthorizedError(
            "You must be logged in to access this ressource"
          )
        );
      }
    } else {
      next();
    }
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
