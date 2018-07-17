// const Cloudant = require('@cloudant/cloudant');

// // Database Connection
// const username = process.env.cloudant_username;
// const password = process.env.cloudant_password;
// const cloudant = Cloudant({ account: username, password:password });


// const mydb = cloudant.db.use('test');

// var hello = false;
// mydb.info((err, result) => {
//     if(result.doc_count === 0) {
//         hello = true;
//     }
// })

// if (hello) {
//     const books = [
//         {author:"Charles Dickens", title:"David Copperfield"},
//         {author:"David Copperfield", title:"Tales of the Impossible"},
//         {author:"Charles Dickens", title:"Great Expectation"}
//     ]

//     mydb.bulk({ docs: books }, function(er) {
//         if (er) {
//             throw er;
//         }

//         console.log('Inserted all documents');
//     })

//     const book_indexer = (doc) => {
//         if (doc.author && doc.title) {
//             index('title', doc.title);
//             index('author', doc.author);
//         }
//     }

//     const ddoc = {
//         _id: '_design/library',
//         indexes: {
//             books: {
//                 analyzer: { name: 'standard' },
//                 index: book_indexer
//             }
//         }
//     };

//     mydb.insert(ddoc, (err) => {
//         if (err) {
//             throw err;
//         }
//         console.log('Created design document with books index');
//     })
// }

// export default mydb;




