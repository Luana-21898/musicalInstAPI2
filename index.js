//express for server and routes
const express = require('express')
//bodyParser for x-www-urlencoded (html form like) variables
const bodyParser = require('body-parser')
// defining the actual app to handle the requests (e.g. push, get, etc.)
const app = express()
const port = 3000
// require the driver to connect to the database
const mongoose = require('mongoose')
// require the class constructor from different file
const MusicalInstruments = require('./musicalinst.js')


//make the app use the bodyParser
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/musicalinst', (req, res) => {
    MusicalInstruments.find((err, musicalinst) => {
        if (err) {
            res.send("Error occured: no Musical Instruments retrieved")
            return
        }
        res.send(musicalinst)
        //log the result in the console as well
        console.log(musicalinst)
    })
})

app.get('/musicalinst/:id', (req, res) => {
    const id = req.params.id;

    MusicalInstruments.findById(id, (err, musicalinst) => {
        if (err) {
            res.send("Musical Instrument not found")
            return
        }
        res.send(musicalinst)
        console.log(musicalinst)
    })
})

app.post('/musicalinst', (req, res) => {
    console.log("Inserting a Musical Instrument in the database")

    let isAvailable = false;
    if (req.body.isAvailable === 'true') {
        isAvailable = true;
    }

    let musicalinst = new MusicalInstruments({

        id: req.body.id,
        type: req.body.type,
        brand: req.body.brand,
        price: parseInt(req.body.price),
        condition: req.body.condition,
        isAvailable: Boolean(req.body.isAvailable),
    });

    musicalinst.save(err => {
        if (err) {
            // if error send a message to let the user know
            res.send(`Musical Instrument not inserted into the database. Error: ${err}`)
            //return to be used in order to not send to res.send and crash the program
            return
        }
        //send a message to the user with the result
        res.send("Musical Instrument inserted into the database")
        console.log("Musical Instrument is in the database")
    })

    //if return runs, code will start from here
    return
})
// -->
app.put('/musicalinst/:id', (req, res) => {
    console.log("Editing a musical instrument")
    console.log(req.body.id)


    MusicalInstruments.findByIdAndUpdate(req.params.id, {
        id: req.body.id,
        type: req.body.type,
        brand: req.body.brand,
        price: ((parseInt(req.body.price) == NaN) ? 0 : parseInt(req.body.price)),
        condition: req.body.condition,
        isAvailable: (Boolean(req.body.isAvailable))
    }, err => {
        if (err) {
            res.send("Not edited. Error: " + err)
            return;
        }
        res.send("Edited!")
    })
})


//delete request using DELETE and a PARAMETER (ID)
app.delete('/musicalinst/:id', (req, res) => {

    MusicalInstruments.findByIdAndDelete(req.params.id, err => {
        if (err) {
            res.send("Musical Instrument not deleted")
            return
        }
        res.send("Musical Instrument deleted")
        console.log(`Musical Instrument ID ${req.params.id} is now deleted`)
    })
})

//start the server
app.listen(port, () => {
    mongoose.connect('mongodb+srv://Luanahf:1223!Mongo@musicalinstapi.xkapt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').
        catch(error => console.log(error));
    console.log(`Example app listening at http://localhost:${port}`)
})


//OLD CODE FOR REFERENCE
/*
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const MusicalInstruments = require('./musicalinst.js')
const mongoose = require('mongoose')
const { Schema } = mongoose
const { isBooleanObject } = require('util/types')

const musicalInstrumentsSchema = new Schema({
    type: String,
    brand: String,
    price: Number,
    condition: Number,
    isAvailable: Boolean
})

const MusicalInstruments = mongoose.model('MusicalInstruments', musicalInstrumentsSchema);

const musicalinst = new MusicalInstruments({type: "Strings", brand: "Ibanez", price: 1400, condition: 0, isAvailable: true})


// const path = require('path');
const { domainToUnicode } = require('url')

app.use(bodyParser.urlencoded({ extended: false }))

/* let musicalinst1 = new MusicalInstruments("String", "Hofner", 280, [0], true);
let musicalinst2 = new MusicalInstruments("String", "Fender", 2000, [1], false);

let musicalinsts = [musicalinst1, musicalinst2]; */

// console.log(musicalinsts);


/*app.get('/', (req, res) => {
    res.send('Hello, Luana França!')
})

app.get('/message', (req, res) => {
    res.send('This is a message.')
})

app.get('/secondmessage', (req, res) => {
    res.send('This is a second message.')
})

app.get('/showmusicalinst', (req, res) => {
    console.log('Someone is requiring a musical instrument')
    res.send(musicalinsts)
})

app.post('/showmusicalinst', (req, res) => {
    console.log('Someone is trying to post something')
    res.send('Heyyyy, you posted something')
    console.log(req.body);

    // let type = req.body.type;
    // let brand = req.body.brand;
    // let price = parseInt(req.body.price);
    // let condition = req.body.condition;
    // let _isAvailable = isBooleanObject(req.body._isAvailable);

    let inst = new MusicalInstruments(req.body.type, req.body.brand, parseInt(req.body.price), req.body.condition, isBooleanObject(req.body._isAvailable));
    
    musicalInsts.push(inst)
    console.log(inst)
})

app.delete('/deletemusicalinst/:brand', (req, res) => {

  let newMusicalsArray = [];
  musicalinsts.forEach(d => {
      if (!(d._brand === req.params.brand)) {
          newMusicalsArray.push(d)
      }
  })
  console.log("Musical Instrument deleted. This is the new database:")
  console.log(newMusicalsArray);
  musicalinsts = newMusicalsArray;
  res.send("Delete in progress");

})

app.put('/updatemusicalinstr/', (req, res) => {

})

app.post('musicalinst/', (req,res)=>{
  console.log("Inserting a musical instrument in the database")
  musicalinst.save()
  res.send("Musical Instrument Saved")
})

app.listen(port, () => {

  mongoose.connect('mongodb+srv://Luanahf:1223!Mongo@musicalinstapi.xkapt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').
      catch(error => console.log(error));
  console.log(`Example app listening at http://localhost:${port}`)
})
*/