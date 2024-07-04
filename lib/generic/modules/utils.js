const express = require("express");
const bodyParser = require("body-parser");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mySqlPool = require("../database/mysql_pool");
const GetResourceService = require("../modules/services/get_resource_by_id_service");
const ImageService = require("../modules/services/image_service");
const ResponseHandler = require("../response/response_handler");

module.exports = {
  express,
  bodyParser,
  joi,
  bcrypt,
  jwt,
  mySqlPool,
  GetResourceService,
  ImageService,
  ResponseHandler,
};
