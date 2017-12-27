// const startingRequest = () => ({
//   type: 'STARTING_REQUEST',
// });

// const finishedRequest = response => ({
//   type: 'FINISHED_REQUEST',
//   response,
// });

// const getGraph = payload => (dispatch) => {
//   dispatch(startingRequest());
//   return new Promise((resolve) => {
//     const request = new XMLHttpRequest();
//     request.open('POST', 'http://localhost:4000/graphql', true);
//     request.setRequestHeader('Content-Type', 'application/json');
//     request.send(JSON.stringify(payload));
//     request.onreadystatechange = () => {
//       if (request.readyState === 4) {
//         resolve(request.responseText);
//       }
//     };
//   }).then(response =>
//     dispatch(finishedRequest(response ? JSON.parse(response) : { boardgames: [] })));
// };

// export default getGraph;
