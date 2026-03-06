var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users')

/* GET users listing. */
///api/v1/users
router.get('/', async function(req, res, next) {
  let data = await userSchema.find({})
  let result = data.filter(function (e) {
    return (!e.isDeleted)
  })
  res.send(result);
});

// Get user by id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOne(
      { _id: req.params.id, isDeleted: false }
    );
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

// Soft delete user
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id,
      { isDeleted: true }, {
      new: true
    })
    res.status(200).send(result)
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

// Enable user
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username },
      { status: true },
      { new: true }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    });
  }
});

// Disable user
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username },
      { status: false },
      { new: true }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    });
  }
});

module.exports = router;
