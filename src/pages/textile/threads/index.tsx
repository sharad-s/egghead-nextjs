import { useEffect, useState } from "react"

import NextLink from "next/link";
import {
  Heading,
  Link,
  Flex,
  Text,
  Stack,
  Button,
  Box
} from "@chakra-ui/core";

// Textile
import {
  setupDB2,
  getIdentity,
  createNewIdentity,
  listThreads,
  createDB
} from '../../../utils/textile'

const AboutPage = () => {

  const [privKey, setPrivKey] = useState('')
  const [client, setClient] = useState({})
  const [threads, setThreads] = useState([])


  useEffect(() => {
    doTheYea()
  }, [])


  const doTheYea = async () => {

    const privateKey = await getIdentity();
    setPrivKey(privateKey.toString())

    const client = await setupDB2(privateKey);
    let threads = await listThreads(client);

    console.log('PK:', privateKey.toString())
    console.log('threads 1', { threads })

    if (threads.listList.length === 0) {
      const threadID = await createDB(client)
      console.log('Created thread! - ', threadID)
      threads = await listThreads(client);
    }

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

  return (
    <Box>
      <Flex margin="1rem" justifyContent="flex-end">
        <NextLink href="/" passHref>
          <Link>Home</Link>
        </NextLink>
      </Flex>
      <Flex
        flexDirection="column"
        alignItems="center"
        margin="2rem"
      >
        <Heading as="h1" size="xl" marginY="2rem">
          Textile
        </Heading>

        <Heading as="h2" size="xl" marginY="2rem">
          Threads introduction
        </Heading>

        <Button onClick={handleCreateNewIdentity}>
          Generate new Identity
          </Button>

        <Heading as="h5" size="xl" marginY="2rem">
          Private Key
        </Heading>

        <Text>
          {privKey}
        </Text>

        <Heading as="h5" size="xl" marginY="2rem">
          Client
        </Heading>

        <Text>
          {(Object.keys(client).length == 0)
            ? (<p>No client...</p>)
            : (<p>Client ready</p>)
          }
        </Text>

        <Heading as="h5" size="xl" marginY="2rem">
          Threads
        </Heading>

        <ul>
          {
            threads.map(thread => (
              <li>{JSON.stringify(thread)}</li>
            ))
          }
        </ul>


      </Flex>
    </Box>
  );
};

export default AboutPage;
