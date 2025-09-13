import { prisma } from "@repo/db";
import { INode } from "@repo/shared/index";
import express from "express";
import cors from "cors";

const PORT = 8000;

const app = express();
app.use(cors());

app.use(express.json());

app.post("/api/v0/signup", async (req, res) => {
  const userName = "darshjhhan";
  const userEmail = "darshjhjhhan@gmail.com ";
  const userPassword = "abcd1234";
  console.log("lol");
  const user = await prisma.user.create({
    data: {
      name: userName,
      email: userEmail,
      password: userPassword,
    },
  });
  console.log(user);
  res.send("user created ")
});

app.post("/api/v0/signin", async (req, res) => {
  console.log("signin hit");

  res.send("msg form signin");
});

app.post("/api/v0/workflow", async (req, res) => {});

app.get("/api/v0/workflow", async (req, res) => {});

app.get("/api/v0/workflow/:id", async (req, res) => {});

app.put("/api/v0/workflow/:id", async (req, res) => {});

app.post("/api/v0/credential", async (req, res) => {});

app.delete("/api/v0/credential", async (req, res) => {});

app.listen(PORT, () => {
  console.log("app is listning on port :", PORT);
});
