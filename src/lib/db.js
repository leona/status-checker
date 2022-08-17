import { MongoClient } from 'mongodb'

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb:27017/`;
const client = new MongoClient(url);
const dbName = 'status-checker';
await client.connect();
console.log('Connected successfully to mongodb server');
export const db = client.db(dbName);
db.collection('logs').createIndex( { timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 } )
db.collection('events').createIndex( { timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 } )
