import { useEffect, useState } from "react"

import NextLink from "next/link";
import {
  Heading,
  Link,
  Flex,
  Text,
  Stack,
  Button,
  Box,
  Input
} from "@chakra-ui/core";

// Textile
import {
  setupDB2,
  getIdentity,
  createNewIdentity,
  listThreads,
  createBetterThreadsArray,
  createDB,
  createCollectionInDB,
  fetchCollection,
  addDocument,
} from '../../../utils/textile'
import { ThreadID } from "@textile/hub";

const AboutPage = () => {

  const [privKey, setPrivKey] = useState('')
  const [client, setClient] = useState({})

  // Threads
  const [threads, setThreads] = useState([])
  const [betterThreads, setBetterThreads] = useState([])

  // Collections
  const [collections, setCollections] = useState([])
  const [collectionInput, setCollectionInput] = useState('')

  // Documents
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    doTheYea()
  }, [])

  useEffect(() => {
    createBetterThreadsArray(client, threads)
      .then((betterThreads: any) => {
        // Set Better threads
        setBetterThreads(betterThreads)

        // Set the collections from this thread
        const collections = !!betterThreads.length && betterThreads[0].collections
        if (collections) setCollections(collections)
      })
  }, [threads])

  const createSomeFuckassCollections = async (e, threadId, name) => {
    e.preventDefault()

    const threadID = ThreadID.fromString(threadId)
    const collections = await createCollectionInDB(client, threadID, name);
    setCollections(collections)

    setCollectionInput('')
  }

  const doTheYea = async () => {

    const privateKey = await getIdentity();
    setPrivKey(privateKey.toString())

    const client = await setupDB2(privateKey);
    let threads = await listThreads(client);

    console.log('PK:', privateKey.toString())

    if (threads.listList.length === 0) {
      const threadID = await createDB(client)
      console.log('Created thread! - ', threadID)
      threads = await listThreads(client);
    }
    // 
    console.log('threads 2', { threads })

    setClient(client)
    setThreads(threads.listList)
  }

  const handleCreateNewIdentity = async (e) => {
    e.preventDefault();

    // Reset
    setClient({})
    setThreads([])

    const privateKey = await createNewIdentity();
    setPrivKey(privateKey.toString())

    const client = await setupDB2(privateKey);
    let threads = await listThreads(client);

    if (threads.listList.length === 0) {
      const threadID = await createDB(client)
      console.log('Created thread! - ', threadID)
      threads = await listThreads(client);
    }

    console.log('threads 2', { threads })

    setClient(client)
    setThreads(threads.listList)
  }

  const handleCollectionInputChange = ({ target: { value } }) => {
    setCollectionInput(value)
  }

  // Sets the current collection and reads the documents from it
  const handleSetCollection = async (e, collection) => {
    e.preventDefault()

    const { name } = collection

    setSelectedCollection(name)

    const threadID = ThreadID.fromString(threads[0].id)
    const documents = await fetchCollection(client, threadID, name)
    setDocuments(documents)


  }

  const handleAddDocumentToCollection = async (e, collectionName) => {
    const document = makeFakeData();

    const threadID = ThreadID.fromString(threads[0].id)

    await addDocument(client, threadID, collectionName, document)

    const documents = await fetchCollection(client, threadID, collectionName)
    setDocuments(documents)
  }

  const makeFakeData = () => {
    return {
      id: Math.floor(Math.random() * 100),
      slug: Math.random().toString(36).substring(10),
      name: Math.random().toString(36).substring(15)
    }
  }

  const renderedThreads = betterThreads.map(thread => (
    <li key={thread.id}>
      <p>{JSON.stringify(thread)}</p>
      <Box>
        <Flex flexDirection="row" margin="2rem">
          <input name="collectionInput" value={collectionInput} onChange={handleCollectionInputChange} />
          <Button onClick={(e) => createSomeFuckassCollections(e, thread.id, collectionInput)}>
            Create Collection
         </Button>
        </Flex>
      </Box>
    </li>
  ))

  const renderedCollections = collections.map(collection => (
    <li key={collection.name}>
      <Box>
        {JSON.stringify(collection)}
        <Button onClick={(e) => handleSetCollection(e, collection)}>
          Select Collection
      </Button>
      </Box>
    </li>
  ))

  const renderedDocuments = (documents.length == 0)
    ? (<p>No Documents...</p>)
    : documents.map(document => (
      <li>{JSON.stringify(document)}</li>
    ));

  return (
    <Box>
      <Flex margin="1rem" justifyContent="flex-end">
        <NextLink href="/" passHref>
          <Link>Home</Link>
        </NextLink>
      </Flex>

      <Flex
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        margin="2rem"
        width="100%"
      >

        {/* Column 1 */}

        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          margin="2rem"
        >
          <Heading as="h1" size="xl" marginY="2rem">
            Textile Threads
          </Heading>

          <Box background="lime" width="100%">
            <Button onClick={handleCreateNewIdentity}>
              Generate new Identity
            </Button>
            <Heading as="h5" size="xl" marginY="2rem">
              Private Key
           </Heading>
            <Text>
              {privKey}
            </Text>
          </Box>

          <Box background="red" width="100%">
            <Heading as="h5" size="xl" marginY="2rem">
              Client
           </Heading>
            <Text>
              {(Object.keys(client).length == 0)
                ? (<p>No client...</p>)
                : (<p>Client ready</p>)
              }
            </Text>
          </Box>

          <Box background="pink" width="100%">
            <Heading as="h5" size="xl" marginY="2rem">
              Threads
            </Heading>
            <ul>
              {(Object.keys(client).length == 0)
                ? (<p>No client...</p>)
                : renderedThreads
              }
            </ul>
          </Box>

          <Box background="aqua" width="100%">
            <Heading as="h5" size="xl" marginY="2rem">
              Collections
            </Heading>
            <ul>
              {renderedCollections.length == 0
                ? (<p>No Collections...</p>)
                : renderedCollections
              }
            </ul>
          </Box>

          <Box background="coral" width="100%">
            <Heading as="h5" size="xl" marginY="2rem">
              Documents
            </Heading>
            {!!selectedCollection && (
              <>
                <Heading as="h5" size="lg" marginY="2rem">
                  Collection: {selectedCollection}
                </Heading>
                <Button onClick={(e) => handleAddDocumentToCollection(e, selectedCollection)}>
                  Add a Document
                 </Button>
              </>
            )}
            <ul>
              {!selectedCollection
                ? (<p>No Collection Selected.</p>)
                : renderedDocuments
              }
            </ul>
          </Box>
        </Flex>


      </Flex>
    </Box >
  );
};

export default AboutPage;
