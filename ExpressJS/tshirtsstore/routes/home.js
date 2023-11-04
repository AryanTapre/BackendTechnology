const express = require('express');
const router = express.Router();

const {home} = require('../controllers/home');


router.route("/").get(home);



//FIXME: Exporting Router
module.exports = router;

            


