import { SQLite } from "expo-sqlite";

const db = SQLite.openDatabase("complaints.db");

export const init = () => {
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS complaints (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, details TEXT NOT NULL, spam INTEGER NOT NULL,assigned INTEGER NOT NULL, status TEXT NOT NULL, severity TEXT NOT NULL, category TEXT NOT NULL, complainer TEXT NOT NULL, assignedTo TEXT NOT NULL, onModel TEXT NOT NULL, location TEXT, locationTag TEXT NOT NULL, companyId TEXT NOT NULL, files TEXT, feedbackRemarks TEXT, feedbackTags TEXT  )"
    );
  });
};
