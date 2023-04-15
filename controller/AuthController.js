import { comparePassword, hashPassword } from "../utils/authUtils.js";
import userModel from "../models/UserModel.js";
import Respo from "../models/Respo.js";
import JWT from "jsonwebtoken";

//register controller
export const registerController = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    //validation
    if (!fname) {
      return res.status(401).send({ message: "firts Name is Reqired" });
    }
    if (!lname) {
      return res.status(401).send({ message: "lastName is Reqired" });
    }
    if (!email) {
      return res.status(401).send({ message: "Email is Reqired" });
    }
    if (!password) {
      return res.status(401).send({ message: "Password is Reqired" });
    }

    // for existing user
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User already Exist please login",
      });
    }
    //register User
    const hashedPassword = await hashPassword(password);
    //local save data
    const user = await new userModel({
      fname,
      lname,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Sucessfull",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register",
      error,
    });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.status(404).send({
        success: false,
        message: "Invalid Creditials ",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found please register",
      });
    }
    //pasword check
    const matchPassword = await comparePassword(password, user.password);
    // validation password
    if (!matchPassword) {
      res.status(200).send({
        success: false,
        message: "invalid Password",
      });
    }
    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_Key, {
      expiresIn: "7d",
    });

    //send responce to user
    res.status(200).send({
      success: true,
      message: "login Sucessfull",
      user: {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// create respo

export const respoCreateController = async(req,res)=>{}


//respo

export const respoController = async (req, res) => {
  try {
    const data = await Respo.find({});
    res.status(200).send({
      success: true,
      message: "Data found",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in respo create",
      error,
    });
  }
};
