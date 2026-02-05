const bcrypt = require("bcrypt");

const user = require("./user.schema");
const { generateToken } = require("../../middleware/jwt.middleware");

exports.register = async (req, resp) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return resp.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await user.create({
      name,
      email,
      password: hashedPassword,
      role : role || "user"
    });

    const token = generateToken({
        userId : data._id,
        role : data.role,
    });

    resp.status(201).json({ message: "success", token });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    const isValid = await user.findOne({ email: email });
    if (!isValid) {
      return resp.status(401).json({ message: "Invalid email" });
    }

    const isMatched = await bcrypt.compare(password, isValid.password);
    if (!isMatched) {
      return resp.status(403).json({ message: "Invalid password" });
    }

    const token = generateToken({
        userId : isValid._id,
        role : isValid.role

    });

    resp.status(200).json({ message: "success", token });
  } catch (err) {
    console.log(err);
  }
};
