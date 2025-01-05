const DataModel = require("../../models/users/UserModel");

const OTPSModel = require("../../models/users/OTPModel");

const UserCreateService = require("../../services/users/UserCreateService.js");
const UserLoginService = require("../../services/user/UserLoginService");
const UserUpdateService = require("../../services/user/UserUpdateService");
const UserDetailsService = require("../../services/user/UserDetailsService");
const UserResetPassService = require("../../services/user/UserResetPassService");
const UserVerifyOtpService = require("../../services/user/UserVerifyOtpService");
const UserVerifyEmailService = require("../../services/user/UserVerifyEmailService");

const db = require("../../config/db.js"); // db connection is defined

exports.Registration = async (req, res) => {
    let result = await UserCreateService(req, db);
    res.status(200).json(result);
};

exports.Login = async (req, res) => {
    let result = await UserLoginService(req, db);
    res.status(200).json(result);
};

exports.ProfileUpdate = async (req, res) => {
    let result = await UserUpdateService(req, db);
    res.status(200).json(result);
};

exports.ProfileDetails = async (req, res) => {
    let result = await UserDetailsService(req, db);
    res.status(200).json(result);
};

exports.RecoverVerifyEmail = async (req, res) => {
    let result = await UserVerifyEmailService(req, db);
    res.status(200).json(result);
};

exports.RecoverVerifyOTP = async (req, res) => {
    let result = await UserVerifyOtpService(req, db);
    res.status(200).json(result);
};

exports.RecoverResetPass = async (req, res) => {
    let result = await UserResetPassService(req, db);
    res.status(200).json(result);
};
