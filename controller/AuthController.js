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
      return;
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found please register",
      });
      return;
    }
    //pasword check
    const matchPassword = await comparePassword(password, user.password);
    // validation password
    if (!matchPassword) {
      res.status(200).send({
        success: false,
        message: "invalid Password",
      });
      return;
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

//respo

export const respoController = async (req, res) => {
  try {
    // const client = new mongodb.MongoClient(process.env.MONGODB_URL);
    // const db = await client.connect();
    // const data1 = await (await db.db("polymer"))
    //   .collection("respo")
    //   .find({})
    //   .toArray();
    const data = await Respo.find({});
    // console.log(data1);
    res.status(200).send({
      success: true,
      message: "Data found",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in respo create",
      error,
    });
  }
};

//search respo

export const respoSearchController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    let sort = req.query.sort;
    let language = req.query.language || "All";

    const languageOptions = [
      "Java",
      "Ruby",
      "PHP",
      "C#",
      "JavaScript",
      "Python",
    ];
    let lan = await Respo.find({}, { language: 1, _id: 0 });
    console.log(lan);

    // let languageOptions = lan.map((item) => item.language);
    // console.log(languageOptions);
    language === "All"
      ? (language = [...languageOptions])
      : (language = req.query.language.split(","));
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const data = await Respo.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { language: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    })
      .where("language")
      .in([...language])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Respo.countDocuments({
      language: { $in: [...language] },
      name: { $regex: search, $options: "i" },
    });

    const response = {
      error: false,
      total,
      language,
      page: page + 1,
      limit,
      language: languageOptions,
      data,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in respo Search",
      error,
    });
  }
};
