# Code Setup

## Clone the repository

clone the repo using command *git clone https://github.com/Umuzi-org/Brendon-Pillay-282-node-sql-assignment-javascript.git*

change to the correct branch using command *git checkout assignment*

## Install dependencies

run `npm i` to install all necessary dependencies found in the package.json

## Testing work

create a `.env`

populate the `.env` file with the following:
```
DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=(database password)
DB_PORT=5433
```

run `docker-compose up -d` to start docker compose

head to [Link Text](http://localhost:8080/) to open *Adminer* 

input the following information

- **System**: PostgreSQL
- **Server**: db
- **Username**: postgres
- **Password**: (your password)

run `npm t` in the terminal to test the project

## Basic usage

type `node` in the terminal and type in the following code

### Creating the table

```javascript
   const {createTable} = require('./src/index.js')
   createTable().then(res => console.log(res)).catch(err => console.log(err))
```

### Adding a visitor

input the following

 ```javascript
 const {addNewVisitor} = require('./src/index.js')
 addNewVisitor({
    full_name: 'John Doe',
    visitor_age: 30,
    date_of_visit: '01/01/2025',
    time_of_visit: '10:00',
    assistant_name: 'Jane Smith',
    comments: 'First-time visitor',
  }).then(res => console.log(res))
```
### Listing all visitors

```javascript
 const {listAllVisitors} = require('./src/index.js')
 listAllVisitors().then(res => console.log(res))
 ```

### Updating a visitor

```javascript
 const {updateAVisitor} = require('./src/index.js')
 //change id with a desired id
 updateAVisitor(9, "full_name", "updated name").then(res => console.log(res))
```

### Viewing one visitor

 ```javascript
 const {viewOneVisitor} = require('./src/index.js')
 //change id with a desired id
 viewOneVisitor(id).then(res => console.log(res))
```
### Viewing last visitor
 
 ```javascript
 const {viewLastVisitor} = require('./src/index.js')
 viewLastVisitor().then(res => console.log(res))
 ```

### Deleting a visitor

 ```javascript
 const {deleteAVisitor} = require('./src/index.js')
 //change id with a desired id
 deleteAVisitor(id).then(res => console.log(res))
 ```

### Deleting all visitors

 ```javascript
 const {deleteAllVisitors} = require('./src/index.js')
 deleteAllVisitors().then(res => console.log(res))
 ```

## Running the server

run `npm run start`
head over to [Link Text](http://localhost:3000/new_visitor)