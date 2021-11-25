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
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        });

        app.post('/login', (req, res) => {
            let name = req.body.name;
            let pass = req.body.pass;
            let users = db.collection('Users').find({ "name": req.body.name }).toArray()

                .then(result => {
                    console.log(result[0].pass)
                    //console.log(result.pass, pass)
                    if (result[0].pass == pass) {
                        console.log("YESS")
                        res.redirect('/')
                    }
                    else {
                        console.log("noo")
                        res.redirect('/')
                    }
                })
                .catch(error => console.error(error))
            });

            app.post('/update', (req, res) => {
                let name = req.body.name;
                let pass = req.body.pass;
                let users = db.collection('Users').find({"name": name}).toArray()
                    .then(result => {
                        if (users.pass == req.body.pass) {
                            console.log('yes');
                            res.redirect('/')
                            updateUserPass(req.body.name, req.body.newPass);
                        }
                    })
                    .catch(error => console.error(error))
            });

            app.put(updateUserPass = (name, newPass) => {
                let passChange = db.collection('Users').updateOne(name, { $set: { pass: newPass } })
            });
        })
            .catch(error => console.error(error))