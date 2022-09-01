const AnimalRoutes = require("express").Router();

const { authorize } = require("../../middleware/auth");
const { getAll, getById, getBynick, update, remove, register,login } = require("./animal.controller");
const upload = require("../../middleware/file");
// const rateLimit = require("express-rate-limit");

// const concertCreateRateLimit = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1min
//   max: 40,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

AnimalRoutes.post('/register',upload.single("image"), register);
AnimalRoutes.post('/login', login);
AnimalRoutes.get('/', getAll);
AnimalRoutes.get('/:id', getById);
AnimalRoutes.get('/nick/:nick', [authorize], getBynick);
AnimalRoutes.patch('/:id', [authorize], upload.single("image"), update);
AnimalRoutes.delete('/:id', [authorize], remove);

module.exports = AnimalRoutes;
