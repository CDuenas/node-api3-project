const express = require('express');
const user = require("./userDb");
const posts = require("../posts/postDb")

const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  user.insert(req.body)
    .then((user) => {
      res.status(201).json(user)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Something went wrong"
      })
    })
});

router.post('/:id/posts', validateUserId(), validatePost(), (req, res) => {

  posts.insert({...req.body, user_id:req.params.id })
    .then((post) => {
      res.status(201).json(post)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Something else went wrong"
      })
    })
});

router.get('/', (req, res) => {
  user.get()
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((error) => {
      console.log(error)
        res.status(500).json({
          message: "Something went wrong"
        })
    })
});

router.get('/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId(), (req, res) => {
  user.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((error) => {
      console.log(error)
        res.status(500).json({
          message: "Something went wrong"
        })
    })
});

router.delete('/:id', validateUserId(), (req, res) => {
  user.remove(req.params.id)
    .then((count) => {
      res.status(200).json({
        message: "User successfully deleted.",
      })
    })
    .catch((error) => {
      console.log(error)
        res.status(500).json({
          message: "Something went wrong"
        })
    })
});

router.put('/:id', validateUser(), validateUserId(), (req, res) => {
  user.update(req.params.id, req.body)
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((error) => {
      console.log(error)
        res.status(500).json({
          message: "Something went wrong"
        })
    })
});

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    user.getById(req.params.id)
      .then((user) => {
        if (user) {
          req.user = user
          next()
        } else {
          res.status(404).json({
            message: "invalid user id"
          })
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({
          message: "Something went wrong"
        })
      })
  }
}

function validateUser() {
  return (req, res, next) => {
    if (!req.body) {
      if (!req.body.name) {
        return res.status(400).json({
          message: "Missing required name field"
        })
      } else {
        return res.status(400).json({
          message: "Missing user data"
        })
      }
    }
    next()    
  }  
}


function validatePost() {
  return (req, res, next) => {
    if (!req.body) {
      if (!req.body.text) {
        return res.status(400).json({
          message: "Missing required text field"
        })
      } else {
        return res.status(400).json({
          message: "Missing user data"
        })
      }
    }    
    next()
  }  
}

module.exports = router;
