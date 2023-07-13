import JWT from "jsonwebtoken";

//protected Login

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_Key);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};
