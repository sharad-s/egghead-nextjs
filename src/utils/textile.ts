

// Textile
import {
  Client,
  Identity,
  KeyInfo,
  PrivateKey,
  UserAuth,
  ThreadID,
  createUserAuth
} from '@textile/hub';

export const authorize = async (
  key: KeyInfo,
  identity: Identity,
): Promise<Client> => {
  const client = await Client.withKeyInfo(key)
  const clientGetTokenWithIdentity = await client.getToken(identity)
  return client
}


export const createNewIdentity = async (): Promise<PrivateKey> => {
  /** No cached identity existed, so create a new one */
  const identity = await PrivateKey.fromRandom()

  console.log('YOOO', { identity })


  /** Add the string copy to the cache */
  localStorage.setItem("identity", identity.toString())
  /** Return the random identity */

  return identity
}

export const getIdentity = async (): Promise<PrivateKey> => {
  /** Restore any cached user identity first */
  const cached = localStorage.getItem("identity")
  if (cached !== null) {
    /** Convert the cached identity string to a PrivateKey and return */
    return PrivateKey.fromString(cached)
  }

  // Create a new PrivateKey
  return await createNewIdentity();

}



// Sets up DB
export const setupDB = async (
  auth: UserAuth,
  identity: Identity
) => {
  // Initialize the client
  const client = Client.withUserAuth(auth)

  // Connect the user to your API
  const userToken = await client.getToken(identity)

  // Create a new DB
  const threadID = await client.newDB(undefined, 'nasa')

  // Create a new Collection from an Object
  const buzz = {
    name: 'Buzz',
    missions: 2,
    _id: '',
  }
  await client.newCollectionFromObject(threadID, buzz, { name: 'astronauts' })

  // Store the buzz object in the new collection
  await client.create(threadID, 'astronauts', [buzz])

  return threadID
}



// Sign Transactions with your PrivateKey
export const sign = async (identity: PrivateKey): Promise<any> => {
  const challenge = Buffer.from('Sign this string');

  const credentials = identity.sign(challenge);

  return credentials
}


// FROM THE DOCS



// Authorize a new user to use your Hub API
export const newToken = async (client: Client, privateKey: PrivateKey) => {
  const token = await client.getToken(privateKey)
  return token
}

// Constant KeyInfo
export const keyInfo: KeyInfo = {
  key: 'bdesvznnhmwg366pbmqxorqmchq',
  secret: 'bb35hh7bdano253ijv4rhi3sda7y57g5ep4atqqa'
}

// Get UserAuth instance
export const getUserAuth = async (keyInfo: KeyInfo) => {
  // Create an expiration and create a signature. 60s or less is recommended.
  const expiration = new Date(Date.now() + 60 * 1000)

  try {
    const userAuth: UserAuth = await createUserAuth(keyInfo.key, keyInfo.secret ?? '', expiration)
    // Generate a new UserAuth
    return userAuth
  } catch (err) {
    throw err
  }

}

// Get Client With User Auth
export const getClientWithUserAuth = async (
  userAuth: UserAuth
): Promise<Client> => {
  const client = Client.withUserAuth(userAuth)
  return client
}


// Textile/auth/index.js
export const setupDB2 = async (privateKey: PrivateKey) => {

  const thisKeyInfo = keyInfo

  // Get User Auth using User Key (This is a constant)
  const userAuth = await getUserAuth(thisKeyInfo)

  // Instantiate Client using User Auth
  const client = await getClientWithUserAuth(userAuth);

  // Register the user and get back a Token
  const token = await newToken(client, privateKey);

  console.log('setupDB2', {
    userAuth,
    privateKey,
    client,
    token
  })

  return client;

}


// Once you have the Client, you can run these for threads
export const listThreads = async (client: Client) => {
  const threads = await client.listThreads()
  return threads
}


// Maps over an object of threads that we get from listThreads
// And adds more data.
export const createBetterThreadsArray = async (client, threads) => {

  const betterThreads = await Promise.all(
    threads.map(async ({ id }) => {

      const threadID = ThreadID.fromString(id)

      // For each thread, we have to create a Collection 
      const collections = await createCollectionInDB(client, threadID)

      const out = {
        id,
        collections
      }

      return out;
    })
  )

  return betterThreads
}

// Creates a DB in a Thread
// 1 Thread = 1 DB
export const createDB = async (client: Client) => {
  const thread: ThreadID = await client.newDB(undefined, 'poopDB')
  return thread
}

// Creates a collection in DB if it doesn't exist 
export const createCollectionInDB = async (
  client,
  threadID,
  collectionName = "PEEPEE"
) => {
  try {

    let collections = await client.listCollections(threadID)

    const hasCollection = !!Object.keys(
      collections.filter(({ name }) => name === collectionName)
    ).length

    // If Collection doesn't exist, create it
    if (!hasCollection) await client.newCollection(threadID, { name: collectionName });

    // Query it again
    collections = await client.listCollections(threadID)

    console.log({ collections })

    return collections
  } catch (err) {
    console.error(err)
  }

}


// List all documents in a collection
export const fetchCollection = async (client, threadID, name) => {
  const found = await client.find(threadID, name, {})
  return found
}


// Add Document to collection
export const addDocument = async (client, threadID, collectionName, document) => {
  console.log({ client, threadID, collectionName, document })
  const res = await client.create(threadID, collectionName, [document])
  console.log({ res })
  return res
}