import { connection } from './../app.js';
// Helper function to fetch data with a specific query
// async function fetchData(query: string, ...params: string[]) {
//   connection.query(query, params[0], (err, rows) => {
//     if (err) {
//       throw err;
//     } else {
//       console.log(rows);
//       return rows;
//     }
//   });
// }

// // Helper function to fetch the first entry with a specific query
// const fetchFirstItem = (query, ...params) => {
//   return new Promise((resolve, reject) => {
//     db.get(query, params[0], (err, rows) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(rows);
//       }
//     });
//   });
// };

// // Helper function to change data inthe table
// const runQuery = (query, ...params) => {
//   return new Promise((resolve, reject) => {
//     db.run(query, params[0], function (err) {
//       if (err) {
//         reject(err);
//       } else {
//         //returns the last created/modiefied id
//         resolve(this.lastID);
//       }
//     });
//   });
// };

// // export { fetchData, fetchFirstItem, runQuery };
// export { fetchData };
