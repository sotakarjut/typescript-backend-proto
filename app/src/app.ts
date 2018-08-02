import bluebird from "bluebird";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import { NextFunction, Request, Response} from "express";
import mongoose from "mongoose";
import { default as User, UserModel } from "./models/User";

import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
// Create Express server

dotenv.config({ path: ".env" });

const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(mongoose as any).Promise = bluebird;
mongoose.connect(mongoUrl, {useNewUrlParser: true }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch( (err) => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response ) => {
  return res.send("Hello world!");
});

app.post("/createtestuser", (req: Request, res: Response) => {
  const user = new User({
    password: "passoword",
    username: "John"
  });
  user.save((err: mongoose.Error) => {
    if (err) { return res.send(err); }
    return res.send("Added user" + user );
  });
});
app.get("/users", (req: Request, res: Response ) => {
 User.find({}, (err, users: UserModel[]) => {
    const userMap: any = {};

    users.forEach((user: UserModel ) => {
      userMap[user._id] = user;
    });

    return res.send(userMap);
  });
});

export default app;