// import pg from 'pg';
// import retry from 'retry';

// console.log('Test Postgres connection:');
// const operation = retry.operation({ retries: 3 });
// operation.attempt(() => {
//   const client = new pg.Client();
//   client.connect((e) => {
//     console.log(e);
//     if (operation.retry(e)) {
//       return;
//     }
//     if (!e) {
//       client.end();
//       console.log('Hello Postgres!');
//     }
//   });
// });

const root = {
  boardgames: () => [],
  publishers: () => [],
};

export default root;
