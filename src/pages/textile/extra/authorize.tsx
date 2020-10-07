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
import { authorize, getIdentity, keyInfo} from '../../../utils/textile'

const AboutPage = () => {

  const [client, setClient] = useState({})

  useEffect(() => {
    console.log("loaded.")
    getIdentity()
      .then(identity => {
        console.log({ identity })
        return authorize(keyInfo, identity)
      })
      .then(client => {
        setClient(client)
        console.log({ client })
      })
  }, [])


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
          Signing Txs
        </Heading>

      </Flex>
    </Box>
  );
};

export default AboutPage;
