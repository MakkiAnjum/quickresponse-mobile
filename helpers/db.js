import { SQLite } from "expo-sqlite";

const db = SQLite.openDatabase("complaints.db");

// DB initialize
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS complaints (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, status TEXT NOT NULL, complainer TEXT NOT NULL, assignedTo TEXT NOT NULL, onModel TEXT NOT NULL, companyId TEXT NOT NULL, timeStamp TEXT);",
        [],
        // success function
        () => {
          resolve();
        },
        // if this failed
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

// Drop table
export const drop = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "DROP TABLE IF EXISTS complaints",
        [],
        // success function
        () => {
          resolve();
        },
        // if this failed
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

// INSERT new complaint
export const insertComplaint = (
  id,
  title,
  status,
  complainer,
  assignedTo,
  onModel,
  companyId,
  timeStamp
) => {
  console.log("complainer", complainer);
  console.log("assignedTo", assignedTo);
  console.log("companyId", companyId);
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO complaints (id,title,status, complainer, assignedTo, onModel, companyId, timeStamp) VALUES(?,?,?,?,?,?,?,?)",
        [
          id,
          title,
          status,
          complainer,
          assignedTo,
          onModel,
          companyId,
          timeStamp
        ],
        // success function
        (_, result) => {
          resolve(result);
        },
        // if this failed
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

// INSERT new complaint array
export const insertManyComplaint = complaints => {
  for (const complaint of complaints) {
    const promise = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO complaints (id,title,status, complainer, assignedTo, onModel, companyId, timeStamp) VALUES(?,?,?,?,?,?,?,?)",
          [
            complaint._id,
            complaint.title,
            complaint.status,
            complaint.complainer,
            complaint.assignedTo,
            complaint.onModel,
            complaint.companyId,
            complaint.timeStamp
          ],
          // success function
          (_, result) => {
            resolve(result);
          },
          // if this failed
          (_, err) => {
            reject(err);
          }
        );
      });
    });
    return promise;
  }
};

// fetch complaint
export const fetchComplaint = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * from complaints",
        [],
        // success function
        (_, result) => {
          resolve(result);
        },
        // if this failed
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
