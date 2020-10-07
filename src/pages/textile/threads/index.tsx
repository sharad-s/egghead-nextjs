import { useEffect, useState } from "react"

import NextLink from "next/link";
import {
  Heading,
  Link,
  Flex,
  Text,
  Stack,
  Box
} from "@chakra-ui/core";

// Textile
import { setupDB2, getIdentity, listThreads, createDB } from '../../../utils/textile'

const AboutPage = () => {

  const [privKey, setPrivKey] = useState('')

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

        <Heading as="h5" size="xl" marginY="2rem">
          Private Key
        </Heading>
        <Text>
          {privKey}
        </Text>

      </Flex>
    </Box>
  );
};

export default AboutPage;
