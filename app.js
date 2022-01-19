const fs = require('fs');
const path = require('path');
const db = require('./database')


const express = require('express');
const { Console } = require('console');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'index.html');
    res.sendFile(htmlFilePath);
});

app.get('/restaurants', function(req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');
    res.sendFile(htmlFilePath);
});

app.get('/recommend', function(req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'recommend.html');
    res.sendFile(htmlFilePath);
});

app.post('/recommend', async function(req, res) {
    // const restaurant = req.body;
    var name = req.body.name;
    var address = [req.body.address];
    var typename = req.body.cuisine;
    var rating = req.body.rating;
    var description = req.body.description;
    var website = req.body.website;

    await db.query("INSERT INTO restauantsreview.addresses (address) VALUES (?)", [address]);
    let addressid = await db.query("SELECT LAST_INSERT_ID()");

    await db.query("INSERT INTO restauantsreview.types (name) VALUES (?)", [typename]);
    var typeid = await db.query("SELECT LAST_INSERT_ID()");

    await db.query("INSERT INTO restauantsreview.restaurants (name, address_id, type, website) VALUES (?,?,?,?)", [name, addressid[0][0]['LAST_INSERT_ID()'], typeid[0][0]['LAST_INSERT_ID()'], website]);

    var res_id = await db.query("SELECT LAST_INSERT_ID()");

    await db.query("INSERT INTO restauantsreview.reviews (rating,text,restaurant_id) VALUES (?,?,?)", [rating, description, res_id[0][0]['LAST_INSERT_ID()']]);


    res.redirect('/confirm');
});

app.get("/added", async function(req, res) {
    let sql = await db.query("SELECT restauantsreview.restaurants.id AS Restaurant_Number,restauantsreview.restaurants.name AS restaurant_name," +
        "restauantsreview.types.name AS type_name, restauantsreview.restaurants.website ,restauantsreview.addresses.address AS Address, restauantsreview.reviews.* FROM restauantsreview.reviews " +
        "INNER JOIN restauantsreview.restaurants ON restauantsreview.reviews.restaurant_id = restauantsreview.restaurants.id " +
        "INNER JOIN restauantsreview.addresses ON restauantsreview.restaurants.address_id = restauantsreview.addresses.id " +
        "INNER JOIN restauantsreview.types ON restauantsreview.restaurants.type = restauantsreview.types.id");

    res.send(JSON.stringify(sql));
    // console.log(sql);

})

app.get('/confirm', function(req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'confirm.html');
    res.sendFile(htmlFilePath);
});

app.get('/about', function(req, res) {
    const htmlFilePath = path.join(__dirname, 'views', 'about.html');
    res.sendFile(htmlFilePath);
});

app.listen(3000);
console.log("Server running on 3000!");