import express from "express";
import cors from "cors";
import client from "./client";
import sgMail from "@sendgrid/mail";
const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/sendEmail", (req, res) => {
  console.log(process.env.SENDGRID_API_KEY);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: "mebehera@gmail.com", // Change to your recipient
    from: "mebehera@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(req.body);
  res.send("Email sent!");
});

app.get("/getAllLists", async (req, res) => {
  const lists = await client.list.findMany({
    include: {
      users: true,
    },
  });
  res.send(lists);
});

app.get("/getList/:listId", async (req, res) => {
  const list = await client.list.findUnique({
    where: {
      id: req.params.listId,
    },
  });
  console.log(list);
  res.send(list);
});

app.get("/getAllUsers", async (req, res) => {
  const users = await client.user.findMany();
  res.send(users);
});

app.get("/getUserListRelations", async (req, res) => {
  const userListRelations = await client.userInList.findMany();
  res.send(userListRelations);
});

//create a list - find all the users in selected Users and link them to a new list name listname
app.post("/createList", async (req, res) => {
  const list = await client.list.create({
    data: {
      name: req.body.listName,
    },
  });

  console.log(req.body.selectedUsers);
  const updatedlist = await client.userInList.createMany({
    data: req.body.selectedUsers.map(
      (user: { id: string; name: string; email: string }) => ({
        userId: user.id,
        listId: list.id,
        userName: user.name,
        userEmail: user.email,
      })
    ),
  });
  console.log(updatedlist);

  res.send(list);
});

app.post("/deleteList", async (req, res) => {
  await client.userInList.deleteMany({
    where: {
      listId: req.body.listId,
    },
  });

  const list = await client.list.delete({
    where: {
      id: req.body.listId,
    },
  });
  console.log(list);
  res.send(list);
});

app.post("/deleteUserFromList", async (req, res) => {
  const user = await client.userInList.delete({
    where: {
      userId_listId: {
        userId: req.body.userId,
        listId: req.body.listId,
      },
    },
  });
  res.send(user);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
