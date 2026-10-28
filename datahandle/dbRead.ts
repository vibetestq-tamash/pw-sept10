
import mysql from 'mysql2/promise';

export class DBHandler {

    private myDb: mysql.Connection | null = null;
    //connect to db
    constructor() {
        
    }

    public async connect(host: string, user: string, password: string, database: string, port: number) {
        this.myDb = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            port: port
        });
    }
    
    async readAll(tableName: string) {

        if (!this.myDb) {
            throw new Error('Database connection not established.');
        }
        let data: string | null = null;
        try {
            const [results] = await this.myDb.query(`SELECT * FROM ${tableName}`);
            console.log('Query results:', results);
            data = JSON.stringify(results);
            console.log('Data in JSON format:', data);
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
        return data;

    }

    async write(data: any) {
        if (!this.myDb) {
            throw new Error('Database connection not established.');
        }
        try {
            const query = 'INSERT INTO emp (fname, lname) VALUES (?, ?)';
            for (const row of data) {
                await this.myDb.query(query, [row.fname, row.lname]);
            }
            console.log('Data written to database successfully.');
        } catch (err) {
            console.error('Error writing to database:', err);
            throw err;
        }
    }
}
export default DBHandler;