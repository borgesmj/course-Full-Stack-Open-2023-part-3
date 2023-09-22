const http = require('http')
const express = require('express') 
const morgan = require('morgan');
const app = express()
app.use(express.json())
app.use(morgan('dev'));

morgan.token('postData', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else {
    return '-';
  }
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] - :postData'));

const requestLogger = (request, response, next) => {
  console.log('---');
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);

let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]
    app.get('/', (request, response) => {
      response.send('<h1>Hello World!</h1><h3>This is my phone app</h3>')
    })

    app.get('/info', (request, response) => {
        const currentTime = new Date();
        const numberOfPersons = persons.length;
        
        response.send(`
            <p>phonebook has info for ${numberOfPersons} people</p>
            <p>Request received at: ${currentTime}</p>
        `);
    });

    app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const person = persons.find(person => person.id === id)
        
        if (person){
            response.json(person)
        } else {
            response.status(404).end()
        }
    })

    app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
    
        response.status(204).end()
    })


const generateId = () => {
  const maxId = 1000000;
  let newId;
  
  do {
    newId = Math.floor(Math.random() * maxId);
  } while (persons.some(existingPerson => existingPerson.id === newId));
  
  return newId;
}

    app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      });
    } else if (!body.number) {
      return response.status(400).json({
        error: "number missing"
      });
    } else if (persons.some(existingPerson => existingPerson.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique' 
      });
    } else {
      const person = {
        id: generateId(),
        number: body.number,
        name: body.name
      }

      persons = persons.concat(person)
      response.json(person);
    }
    });

    app.get('/api/persons', (request, response) => {
      response.json(persons)
    })
    
    
    const PORT = 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })







