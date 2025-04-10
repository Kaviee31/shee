import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('womensafety.db');

export const createTables = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS emergency_contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL
            );`,
            [],
            () => console.log("Emergency Contacts Table Created"),
            error => console.log("Error creating table", error)
        );
    });
};

export const addEmergencyContact = (name, phone, successCallback) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO emergency_contacts (name, phone) VALUES (?, ?);',
            [name, phone],
            (_, result) => successCallback(result),
            error => console.log("Error inserting contact", error)
        );
    });
};

export const getEmergencyContacts = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM emergency_contacts;',
            [],
            (_, { rows }) => callback(rows._array),
            error => console.log("Error fetching contacts", error)
        );
    });
};

export default db;
