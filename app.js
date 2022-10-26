//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const uri = "mongodb+srv://jose:1234@cluster0.conr5ph.mongodb.net/todolist";

mongoose.connect(uri, {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  listName: String,
  items: [itemSchema]
});

const flagSchema = new mongoose.Schema({
  firstTime: Boolean,
  currentList: String
});

const Flag = mongoose.model("Flag", flagSchema);

const List = mongoose.model("List", listSchema);


app.get("/", async (req, res) => {
  const flags = await Flag.find();

  if (flags.length === 0) {

    const firstFlag = new Flag({
      firstTime: true,
      currentList: 'tasks'
    });

    firstFlag.save();

    const list = new List();
    list.listName = 'tasks';
    list.items.push({name: "Buy food"});
    list.items.push({name: "Cook food"});
    list.items.push({name: "Eat food"});
    list.save();

    res.redirect("/");

  } else {
    const flags = await Flag.findOne({firstTime: true}).exec();
    const list = await List.findOne({listName: flags.currentList}).exec();

    res.render("list", {listTitle: _.upperFirst(flags.currentList), arrayItems: list.items, listName: list.listName});

  }

});

app.post("/", async (req, res) => {
  const list = await List.findOne({listName: req.body.list}).exec();
  list.items.push({name: req.body.newItem});
  list.save();

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const listName = await Flag.findOne({}, 'currentList').exec();
  const list = await List.findOne({listName: listName.currentList}).exec();
  list.items.id(req.body.checkbox).remove();
  list.save();
  res.redirect("/");
})

app.get("/lists/:list", async (req, res) => {
  const list = await List.findOne({listName: req.params.list});
  const flags = await Flag.findOne({firstTime: true}).exec();

  if (!list) {
    const newList = new List({
      listName: req.params.list,
      items: []
    });

    newList.save();
  }

  flags.currentList = req.params.list;
  flags.save();

  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port " + port);
});
