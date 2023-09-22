# Añadiendo backend al proyecto de libreria telefonica

## 3.1: backend de la agenda telefónica, paso 1
Implemente una aplicación Node que devuelva una lista hardcodeada de entradas de la agenda telefónica desde la dirección http://localhost:3001/api/persons:

Creamos la carpeta backend y con el comando `npm init` entramos los datos

```
    {
  "name": "phonebook_backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Miguel Jose",
  "license": "ISC",
}
```

se le añade manualmente un script

```
    "start": "node index.js",
```

para probar la aplicacion, colocamos un `console.log('hello world')` en el `indfex.js`

y arrancamos la aplicacion

```
    npm start
```

Cambiamos la aplicacion a un servidor web simple

```
    const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

Una vez que la aplicación se está ejecutando, el siguiente mensaje se imprime en la consola:

```
    Server running on port 3001
```

## backend de la agenda telefónica, paso 2

3.2: backend de la agenda telefónica, paso 2
Implemente una página en la dirección http://localhost:3001/info que se parezca más o menos a esto:

![alt text](https://fullstackopen.com/static/26383e4e706a7f89c140690121be2ea1/5a190/23x.png "Logo Title Text 1")

La página tiene que mostrar la hora en que se recibió la solicitud y cuántas entradas hay en la agenda telefónica en el momento de procesar la solicitud

Esto se logro configurando la pagina con express

[Instalar express](https://fullstackopen.com/es/part3/node_js_y_express#express)
[Instalar nodemon](https://fullstackopen.com/es/part3/node_js_y_express#nodemon)

```
app.get('/info', (request, response) => {
    const currentTime = new Date();
    const numberOfPersons = persons.length;
    
    response.send(`
        <p>phonebook has info for ${numberOfPersons} people</p>
        <p>Request received at: ${currentTime}</p>
    `);
});

```

## 3.3: backend de la agenda telefónica, paso 3

Implemente la funcionalidad para mostrar la información de una sola entrada de la agenda. La URL para obtener los datos de una persona con la identificación 5 debe ser http://localhost:3001/api/persons/5

Si no se encuentra una entrada para la identificación dada, el servidor debe responder con el código de estado apropiado.

```
    app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})
```

## 3.4: backend de la agenda telefónica, paso 4

Implemente la funcionalidad que hace posible eliminar una sola entrada de la agenda telefónica mediante una solicitud HTTP DELETE a la URL única de esa entrada de la agenda.

Pruebe que su funcionalidad funcione con Postman o el cliente REST de Visual Studio Code.

```
    app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
```

Comprobando con el clinete REST de VS code

```
    DELETE http://localhost:3001/api/persons/5
```

## 3.5: backend de la agenda telefónica, paso 5

Expanda el backend para que se puedan agregar nuevas entradas a la agenda telefónica realizando solicitudes HTTP POST a la dirección http://localhost:3001/api/persons.

Genere una nueva id para la entrada de la agenda con la función Math.random. Use un rango lo suficientemente grande para sus valores aleatorios de modo que la probabilidad de crear identificadores duplicados sea pequeña.

```
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

```

## 3.6: backend de la agenda telefónica, paso 6
Implemente el manejo de errores para crear nuevas entradas. No se permite que la solicitud se realice correctamente si:

* Falta el nombre o número
* El nombre ya existe en la agenda
* Responda a solicitudes como estas con el código de estado apropiado y también envíe información que explique el motivo del error, por ejemplo:

```
    { error: 'name must be unique' }
```

solucion:

```
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
```

