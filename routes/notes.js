const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes '/api/notes'
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for creating a new note '/api/notes'
notes.post('/', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
        title,
        text,
        id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.error('Error in adding note');
    }
});

// DELETE Route for removing a note '/api/notes/:id
notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Creates a new array of all notes except for the note ID that will be deleted
            const result = json.filter((note) => note.id !== noteId);
    
            // Saves that array to the filesystem
            writeToFile('./db/db.json', result);
            res.json(`The note ${noteId} has been deleted 🗑️`);
        });
});

module.exports = notes;
