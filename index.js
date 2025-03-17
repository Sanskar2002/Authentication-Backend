import express, { urlencoded } from "express";
import dotenv, { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "DELETE", "POST", "OPTIONS"],
    allowedHeaders: ["content-type", "Authorization"],
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hey Sanskar");
});

app.get("/Raunak", (req, res) => {
  res.send("Hey Raunak");
});

app.get("/Bro", (req, res) => {
  res.send("Hey Bro");
});

//connect to db
db();

//user routes
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});
