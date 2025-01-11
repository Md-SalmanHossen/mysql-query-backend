const DataModel = require("../../models/users/UserModel.js");

const OTPSModel = require("../../models/users/OTPModel.js");

const UserCreateService = require("../../services/users/UserCreateService.js");
const UserLoginService = require("../../services/users/UserLoginService.js");
const UserUpdateService = require("../../services/users/UserUpdateService.js");
const UserDetailsService = require("../../services/users/UserDetaialsService.js");
const UserResetPassService = require("../../services/users/UserResetPassService.js");
const UserVerifyOtpService = require("../../services/users/UserVerifyOtpService.js");
const UserVerifyEmailService = require("../../services/users/UserVerifyEmailService.js");


exports.Registration = async (req, res) => {
    console.log(req.body);
    let result = await UserCreateService(req,  DataModel);
    res.status(200).json(result);
};

exports.Login = async (req, res) => {
    let result = await UserLoginService(req,  DataModel);
    res.status(200).json(result);
};

exports.ProfileUpdate = async (req, res) => {
    let result = await UserUpdateService(req,  DataModel);
    res.status(200).json(result);
};

exports.ProfileDetails = async (req, res) => {
    let result = await UserDetailsService(req,  DataModel);
    res.status(200).json(result);
};

exports.RecoverVerifyEmail = async (req, res) => {
    let result = await UserVerifyEmailService(req,  DataModel);
    res.status(200).json(result);
};

exports.RecoverVerifyOTP = async (req, res) => {
    let result = await UserVerifyOtpService(req,  DataModel);
    res.status(200).json(result);
};

exports.RecoverResetPass = async (req, res) => {
    let result = await UserResetPassService(req,  DataModel);
    res.status(200).json(result);
};
