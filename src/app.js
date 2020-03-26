require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const app = express();
const uuid = require('uuid/v4')
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json())

//dont want the whole app to use it, so its not app.use, just function
function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('authorisation')
  if(!authToken || authToken.split('')[1] !==apiToken){
    return res.status(401).json({error:'unauthorised request'})
  }
  next ();
}

const address=[{
  
    "id": "3c8da4d5-1597-46e7-baa1-e402aed70d80",
    "firstName": 'dasha',
    "lastName" : 'akhten',
    'address1': '1234 street',
    'address2': 'suite 20',
    'city': 'los angeles',
    'state': 'CA',
    'zip': '90048'
  
}]

app.get("/address", (req, res) => {
  res.json(address);
});

app.use(function errorHandler(error, req, res, next) {
  let reponse;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.post('/address', validateBearerToken);
app.delete('/address/userId', validateBearerToken)

//validation goes here
app.post('/address', (req, res)=>{
  const {firstName, lastName, address1, address2=false, city, state, zip}=req.body;
  if(!address1){
return res.status(400).send('address is required')
  }
  if(!firstName){
    return res.status(400).send('first name is required')

  }
  if(!lastName){
    return res.status(400).send('last name is required')

  }
  if(!city){
    return res.status(400).send('city is required')

  }
  if(!state){
    return res.status(400).send('state is required')

  }
  if(!zip){
    return res.status(400).send('zip is required')

  }

  if (zip.length !== 5){
    return res.status(400).send('zip code must be at least 5 characters')
  }

  if (state.length !== 2) {
  return res.status(400).send('please enter state abbreviation')
  }
  const id = uuid();
  const newAddress = { 
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip

  }
  address.push(newAddress);
  res.status(201).location(`http://localhost:8000/address/${id}`).json({id: id})
  res.send('all validation complete')
})

app.delete('/address/:id', (req, res)=>{
  const {userId}=req.params;
  console.log(userId);
  res.send('got it!')
  const index=adress.findIndex(address => address.id === id)
  if (index === -1){
    return res.status(404).send('address does not exist')
  }
  adress.splice(index, 1)
  res.send('deleted')
})

module.exports = app;


// Create a GET route on /address that fetches all addresses
// Create a POST route on /address that creates a new address
// The new record should have the following validations:
// id is auto generated
// ALL fields except address2 are required
// state must be exactly two characters
// zip must be exactly a five-digit number
// you DON’T need to validate if the state/zip are “real”
// Create a DELETE route on /address/:id
// Add Bearer Token Authorization middleware on ONLY the POST/DELETE routes