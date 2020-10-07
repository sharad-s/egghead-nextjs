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
import { Client, Identity, KeyInfo, PrivateKey, UserAuth } from '@textile/hub';

  
const auth: UserAuth = {
  msg: '<api msg>',
  sig: '<api sig>',
  token: '<user msg>',
  key: '<api key>',
}

const keyinfo: KeyInfo = {
  key: 'bdesvznnhmwg366pbmqxorqmchq',
}

async function authorize (key: KeyInfo, identity: Identity) {
  const client = await Client.withKeyInfo(key)
  await client.getToken(identity)
  return client
}

const getIdentity = async (): Promise<PrivateKey> => {
  /** Restore any cached user identity first */
  const cached = localStorage.getItem("user-private-identity")
  if (cached !== null) {
    /** Convert the cached identity string to a PrivateKey and return */
    return PrivateKey.fromString(cached)
  }
  /** No cached identity existed, so create a new one */
  const identity = await PrivateKey.fromRandom()
  /** Add the string copy to the cache */
  localStorage.setItem("identity", identity.toString())
  /** Return the random identity */
  return identity
}

const AboutPage = () => {

  const [client, setClient] = useState({})

  useEffect(() => {
    console.log("loaded.")
    getIdentity()
      .then(identity => {
        console.log({ identity })
        return authorize(keyinfo, identity)
      })
      .then(client => {
        // console.log({ client })
        setClient(client)
      })
  }, [])

  useEffect(() => {
    console.log({client})
  }, [client])

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
