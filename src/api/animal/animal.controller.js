const Animal = require('./animal.model');
const  bcrypt = require('bcrypt');
const { createToken } = require('../../helpers/token-action');
const { setError } = require('../../helpers/utils');
const { deleteFile } = require("../../middleware/delete-file");

//----------------------------------------------------------------------------------------------
const getAll = async (req, res, next) => {
  try {
    const animal  = await Animal.find();
    return res.json({
      status: 200,
      message: 'Recovered all animal',
      data: { animal}
    });
  } catch (error) {
    return next(setError(500, 'Failed all Animal'));
  }
}
//----------------------------------------------------------------------------------------------
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    if (!animal) return next(setError(404, 'Animal not found'))
    return res.json({
      status: 200,
      message: 'Recovered animal by id',
      data: { animal }
    });
  } catch (error) {
    return next(setError(500, 'Failed animal by id'))
  }
}
//----------------------------------------------------------------------------------------------
const getBynick = async (req, res, next) => {
  try {
    const { nick } = req.params;
    const animal = await Animal.find({ nick: nick });
    if (!animal) return next(setError(404, 'Animal not found'));
    return res.json({
      status: 200,
      message: 'Recovered animal by nick',
      data: { animal }
    });
  } catch (error) {
    return next(setError(500, 'Failed animal by nick'))
  }
}
//----------------------------------------------------------------------------------------------

const update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const animalDB = await Animal.findById(id);
      if (!animalDB) {
        return next("Animal not found");
      }
  
    if (animalDB && req.file) {
      deleteFile(animalDB.image);
    }
  
      const patchAnimalDB = new Animal(req.body);
  
      patchAnimalDB._id = id;

      if (req.file) {
        patchAnimalDB.image = req.file.path;
      }
      const AnimalDB = await Animal.findByIdAndUpdate(id, patchAnimalDB);
      return res.status(200).json({ new: patchAnimalDB, old: AnimalDB });
    } catch (error) {
      return next("Error to modify animal", error);
    }
  };


//----------------------------------------------------------------------------------------------
const remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      const animalDB = await Animal.findByIdAndDelete(id);
  
      if (!animalDB) {
        return next("Animal not found");
      }
  
      if (animalDB) {
        deleteFile(animalDB.image);
      }

      return res.status(200).json(animalDB);
    } catch (error) {
      return next("This animal can't delete ", error);
    }
  };
//----------------------------------------------------------------------------------------------

const register = async (req, res, next)=>{
  try {
      const newAnimal =  new Animal(req.body);

      const nickExist = await Animal.findOne({nick: newAnimal.nick});

      if ( nickExist) return next(setError(409, 'this animal already exist'));

      if (req.file) newAnimal.image = req.file.path;
      const animalInDb =await newAnimal.save();
    
      res.status (201).json(animalInDb);

  } catch (error) {
      return next(setError(500, error.message || 'Failed create animal'));
  }
}
//----------------------------------------------------------------------------------------------

const login = async (req, res, next )=> {

  try {
      const animalInDb = await Animal.findOne({nick: req.body.nick});
      if (!animalInDb) return next(setError(404, 'Animal no found'));

      if(bcrypt.compareSync(req.body.password, animalInDb.password)){
          const token = createToken(animalInDb._id, animalInDb.nick);
          return res.status(200).json({animalInDb, token})
      }else {
          return next(setError(401, 'invalid password'));
      }

  } catch (error) {
      return next(setError(500, error.message || 'Unexpected error login'));
  }
}

module.exports = {
  getAll,
  getById,
  update,
  remove,
  getBynick,
  register,
  login

}