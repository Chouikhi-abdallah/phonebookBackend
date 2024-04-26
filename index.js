const express = require('express');
const app=express();
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

const morgan = require('morgan');
morgan.token("post-body", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-body"));

let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
app.get('/',(request,response)=>{
    response.send("<h1>Hello World !</h1>");
});
app.get('/api/persons',(request,response)=>{
  response.json(persons);
});
app.get('/info',(request,response)=>{
response.send(
  `
  <p>Phonebook has info for ${persons.length} people</p>
  <br/>
  <p> ${new Date().toDateString()} ${new Date().toLocaleTimeString()} </p>


  `
)
});
app.get('/api/persons/:id',(request,response)=>{
  const id=Number(request.params.id);
  console.log(id);
  const person =persons.find((person)=>person.id===id)
  console.log(person);
  if(person){
    response.json(person)
  }
  else{
    response.status(404).end();
  }
});

app.delete('/api/persons/:id',(request,response)=>{
const id=Number(request.params.id);
persons=persons.filter(person=>person.id!==id);
response.status(204).end();
});

app.post('/api/persons',(request,response)=>{
  const maxId=persons.length>0 ? Math.max(...persons.map((n)=>n.id)):0;

  const body=request.body;
  console.log(body);
  if(!body.name){
    return response.status(400).json({
      error:'name missing'
    });
  }
  if(!body.number){
    return response.status(400).json({
      error:'number missing'
    });
  }
  if(persons.find(person=>person.name===body.name)){
    return response.status(400).json({
      error:'name must be unique'
    });
  }
  const person={

    id:Math.floor(Math.random() * (1000 - maxId)) + maxId,
    name:body.name,
    number:body.number
  }
  persons=persons.concat(person);
  response.json(person);



});





const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
  console.log(`server running in http://localhost:${PORT}`);
})

