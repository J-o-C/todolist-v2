//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolist", {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  listName: String,
  items: [itemSchema]
});

const flagSchema = new mongoose.Schema({
  firstTime: Boolean
});

const Flag = mongoose.model("Flag", flagSchema);

const List = mongoose.model("List", listSchema);


let listAux = "tasks";

app.get("/", async (req, res) => {
  const flags = await Flag.find();

  if (flags.length === 0) {

    const firstFlag = new Flag({
      firstTime: true
    });

    firstFlag.save();

    const list = new List();
    list.listName = 'tasks';
    list.items.push({name: "Buy food"});
    list.items.push({name: "Cook food"});
    list.items.push({name: "Eat food"});
    list.save();

    listAux = 'tasks';

    res.redirect("/");

  } else {
    const list = await List.findOne({listName: listAux}).exec();

    res.render("list", {listTitle: "tasks", arrayItems: list.items});

  }

});

app.post("/", function(req, res) {


});

app.post("/delete", function(req, res) {
})

app.get("/:list", function(req, res) {

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
