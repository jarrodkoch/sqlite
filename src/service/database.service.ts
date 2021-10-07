import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private db: SQLiteObject;

  constructor(private sqlite: SQLite) {}

  async getDB() {
    if (!this.db) {
      this.db = await this.sqlite.create({ name: '_cgdb', location: 'default' });
      await this.createTables(this.db);
    }

    return this.db;
  }

  // #region metaData

  async createTables(db: SQLiteObject) {
    await db.executeSql(
      `
        CREATE TABLE IF NOT EXISTS targetedLists (
          listName TEXT NOT NULL UNIQUE,
          value TEXT,
          PRIMARY KEY(listName)
        )`,
      []
    );
  }

  async getValue(listName: string) {
    const db = await this.getDB();
    const result = await db.executeSql(`SELECT value FROM targetedLists WHERE listName=?`, [listName]);

    if (!result.rows.length) {
      return null;
    }

    return JSON.parse(result.rows.item(0).value);
  }

  async setValue(listName: string, value: any) {
    const db = await this.getDB();
    await db.executeSql('INSERT OR REPLACE INTO targetedLists (listName, value) VALUES (?,?)', [
      listName,
      JSON.stringify(value),
    ]);
  }

  async clearTables() {
    const db = await this.getDB();

    await db.executeSql('DROP TABLE IF EXISTS targetedLists', []);
    await this.createTables(db);
  }

  // #endregion
}
