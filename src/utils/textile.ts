// // Once you have the Client, you can run these for threads
// export const listThreads = async (client: Client) => {
//   const threads = await client.listThreads()
//   return threads
// }


// // Maps over an object of threads that we get from listThreads
// // And adds more data.
// export const createBetterThreadsArray = async (client, threads) => {

//   const betterThreads = await Promise.all(
//     threads.map(async (thread) => {

//       const threadID = ThreadID.fromString(thread.id)

//       // For each thread, we have to create a Collection 
//       const collections = await createCollectionInDB(client, threadID)

//       const out = {
//         ...thread,
//         collections
//       }

//       return out;
//     })
//   )

//   return betterThreads
// }

