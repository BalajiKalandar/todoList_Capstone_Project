import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/PattuDB");

const itemSchema = new mongoose.Schema({
  // Define schema using new mongoose.Schema
  name: String,
});

app.get("/add-list", function (req, res) {
  res.render("add-list");
});

app.get("/", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((collection) => collection.name);

    //   res.status(200).json(collectionNames);
    res.render("index", { listItems: collectionNames });
  } catch (error) {
    console.error("Error retrieving collections:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-list", async (req, res) => {
  try {
    const { newItem } = req.body;

    // Check if the collection already exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const existingCollections = collections.map(
      (collection) => collection.name
    );
    if (existingCollections.includes(newItem)) {
    //   return res.status(400).json({ error: "Collection already exists" });
    res.send("Collection already")
    }

    // Create the new collect
    console.log(newItem);
    await mongoose.connection.db.createCollection(newItem);
    res.redirect("/");
    // res
    //   .status(201)
    //   .json({ message: `Collection '${newItem}' created successfully` });
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.set("view engine", "ejs");
///________________________
// Get data from a specific collection
app.get("/list/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;

    // Check if the collection exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const existingCollections = collections.map(
      (collection) => collection.name
    );
    if (!existingCollections.includes(collectionName)) {
      return res.status(404).json({ error: "Collection not found" });
    }
    // Fetch data from the specified collection
    const collectionData = await mongoose.connection.db
      .collection(collectionName)
      .find({})
      .toArray();
    // res.redirect("/list");
    res.render("list", { list: { name: collectionName,items:collectionData } });
    // res.status(200).json(collectionData);
  } catch (error) {
    console.error("Error fetching collection data:", error);
    res.status(500).send("Internal Server Error");
  }
});

//------------------------------------------------
// Create a new record in a collection
app.post("/list/:collectionName/add-item", async (req, res) => {
    try {
      const { collectionName } = req.params;
      const newData = req.body;
      // Check if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const existingCollections = collections.map(collection => collection.name);
    if (!existingCollections.includes(collectionName)) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    // Insert the new record into the specified collection
    await mongoose.connection.db.collection(collectionName).insertOne(newData);
   
    // res.status(201).json({ message: 'Record added successfully' });
    const collectionData = await mongoose.connection.db
    .collection(collectionName)
    .find({})
    .toArray();
  // res.redirect("/list");
  res.render("list", { list: { name: collectionName,items:collectionData } });
    
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).send('Internal Server Error');
  }
});
// app.get("/add-list", function (req, res) {
//     res.render("list");
//   });






      //----------------------------------------------
// app.post("/list/:listID/add-item", function (req, res) {
//   console.log(req, req.body);
//   const listID = req.params.listID;
//   const newItemName = req.body.newItem;
//   console.log(newItemName);

//   Item.findById(listID)
//     .then((foundList) => {
//       if (!foundList) {
//         console.log("List not found");
//         return res.redirect("/"); // or handle the error appropriately
//       }

//       // Initialize list.items if it's undefined
//       foundList.items = foundList.items || [];

//       // Push the new item to the list
//       foundList.items.push({ name: newItemName });

//       // Save the updated list to the database
//       return foundList.save();
//     })
//     .then((savedList) => {
//       // Redirect to the list page after successfully adding the item
//       res.redirect("/list/" + listID);
//     })
//     .catch((err) => {
//       console.error("Error adding item:", err);
//       res.status(500).send("Internal Server Error"); // Handle error appropriately
//     });
// });
app.get("/redirect-home", function (req, res) {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
