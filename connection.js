import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Base de données dans un fichier
const connectionPromise = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

export default connectionPromise;