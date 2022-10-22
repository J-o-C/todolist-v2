//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

const defaults = [{name: "Buy Food"}, {name: "Cook Food"}, {name: "Eat Food"}];

app.get("/", async (req, res) => {
  const flags = await Flag.find();
  const lists = await List.find();

  if (flags.length === 0) {
    console.log("no lists has been created");

    const firstFlag = new Flag({
      firstTime: true
    });

    firstFlag.save();

    const list = new List({
      listName: "tasks",
      items: [{name: "Buy Food"}, {name: "Cook Food"}, {name: "Eat Food"}]
    });

    list.save();

    res.redirect("/");

  } else {
    console.log(lists);
  }

});

app.post("/", function(req, res) {
  const newItem = req.body.newItem;

  const item = new Item({
    name: newItem
  });

  item.save()

  res.redirect("/");

});

app.post("/delete", function(req, res) {
  Item.findOneAndDelete({_id: req.body.checkbox}, function(err, itemDeleted) {
    if (err) {
      console.log(err);
    } else {
      console.log("Item deleted: " + itemDeleted.name);
    }
  });

  res.redirect("/");
})

app.get("/:list", function(req, res) {

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
