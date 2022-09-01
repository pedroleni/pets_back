const Animal = require("../api/animal/animal.model");
const { verifyToken } = require("../helpers/token-action");
const { setError } = require("../helpers/utils");


const authorize = async (req, _res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return next(setError(401, "Unauthorize"));
    const parsedToken = token.replace("Bearer ", "");
    const validToken = verifyToken(parsedToken, process.env.JWT_SECRET);
    if (!validToken) return next(setError(401, "Unauthorize"));
    const animal = await Animal.findById(validToken.id);
    delete animal.password;
    req.animal= animal;
    next();
  } catch (error) {
    return next(setError(401, 'Unathorize'));
  }
}

module.exports = { authorize }