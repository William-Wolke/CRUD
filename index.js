const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017'
const app = express();

const dbName = 'User';

//Mongo db
MongoClient.connect(url, { useNewUrlParser: true })
    .then(client => {
        // Storing a reference to the database so you can use it later
        const db = client.db(dbName)
        const userCollection = db.collection('Users')
        console.log(`Connected MongoDB: ${url}`)
        console.log(`Database: ${dbName}`)

        //Body parser
        app.use(bodyParser.urlencoded({ extended: true }));
        //Handlers
        app.listen(3000, () => {
            console.log('listening on 3000');
        });

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/home.html');
        });

        app.post('/create', (req, res) => {
            userCollection.insertOne(req.body)
                .then(result => {
                    console.log("User created")
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        });

        app.post('/login', (req, res) => {
            let name = req.body.name;
            let pass = req.body.pass;
            let users = db.collection('Users').find({ "name": name }).toArray()

                .then(result => {
                    console.log(result[0].pass)
                    //console.log(result.pass, pass)
                    if (result[0].pass == pass) {
                        console.log("Logged in")
                        res.redirect('/')
                    }
                    else {
                        console.log("Incorrect password or username")
                        res.redirect('/')
                    }
                })
                .catch(error => console.error(error))
        });

        app.post('/update', (req, res) => {
            let name = req.body.name;
            let oldPass = req.body.oldPass;
            let newPass = req.body.newPass;
            let users = db.collection('Users').find({ "name": name }).toArray()

                .then(result => {
                    console.log(result[0].pass)
                    //console.log(result.pass, pass)
                    if (result[0].pass == oldPass) {
                        console.log("Correct credentials")
                        updateUserPass(result[0].name, newPass);
                        res.redirect('/')
                    }
                    else {
                        console.log("Incorrect password or username")
                        res.redirect('/')
                    }
                })
                .catch(error => console.error(error))
        });

        app.post('/delete', (req, res) => {
            let name = req.body.name;
            let pass = req.body.pass;
            let users = db.collection('Users').find({ "name": name }).toArray()

                .then(result => {
                    console.log(result[0].pass)
                    //console.log(result.pass, pass)
                    if (result[0].pass == pass) {
                        console.log("Correct credentials")
                        deleteUser(name);
                        res.redirect('/')
                    }
                    else {
                        console.log("Incorrect password or username")
                        res.redirect('/')
                    }
                })
                .catch(error => console.error(error))
        });

        app.put(updateUserPass = (name, newPass) => {
            let passChange = db.collection('Users').updateOne({ "name": name }, { $set: { pass: newPass } })
            .then(result => {
                console.log("Password changed")
            })
            .catch(error => console.error(error));
        });

        app.delete(deleteUser = (name) => {
            let deleteUser = db.collection('Users').deleteOne({ "name": name })
            .then(result => {
                console.log("User deleted")
            })
            .catch(error => console.error(error));
        });
    })
    .catch(error => console.error(error))