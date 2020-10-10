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

import { loginAndSetupDB } from '../../utils/setup'

import {
    fetchCollection,
    addDocument,
} from '../../utils/api'

const TextilePage = () => {

    const [privKey, setPrivKey] = useState('')
    const [client, setClient] = useState({})

    // Threads
    const [thread, setThread] = useState([])
    const [betterThreads, setBetterThreads] = useState([])

    // Collections
    const [collections, setCollections] = useState([])
    const [collectionInput, setCollectionInput] = useState('')

    // Documents
    const [selectedCollection, setSelectedCollection] = useState(null)
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        setup({newIdentity: false})
    }, [])


    const setup = async ({ newIdentity = false }) => {
        const [
            client,
            privateKey,
            thread,
            collections
        ] = await loginAndSetupDB({ newIdentity })

        setPrivKey(privateKey.toString())
        setClient(client)
        setThread(thread)
        setCollections(collections)
    }

    // Sets the current collection and reads the documents from it
    const handleSetCollection = async (e, collection) => {
        e.preventDefault()
        const { name } = collection

        const documents = await fetchCollection(client, name)

        setSelectedCollection(name)
        setDocuments(documents)
    }

    const handleAddDocument = async (e, collectionName) => {
        await addDocument(client, collectionName, document)
        const documents = await fetchCollection(client, collectionName)
        setDocuments(documents)
    }

    const handleResetIdentity = async (e) => {
        e.preventDefault();

        // Reset
        setPrivKey('')
        setClient({})
        setThread('')
        setCollections([])
        setCollections([])
        setDocuments([])

        await setup({ newIdentity: true })
    }

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
                        <Button onClick={handleResetIdentity}>
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
                                : (
                                    <>
                                        <p>Client ready</p>
                                        <p>Thread: {JSON.stringify(thread)}</p>
                                    </>
                                )
                            }
                        </Text>
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
                                <Button onClick={(e) => handleAddDocument(e, selectedCollection)}>
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

export default TextilePage;
