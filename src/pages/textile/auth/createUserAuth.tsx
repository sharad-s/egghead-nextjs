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
import {
  KeyInfo,
} from '@textile/hub';
import { getUserAuth, keyInfo } from '../../../utils/textile'

const AboutPage = () => {

  useEffect(() => {
    getUserAuth(keyInfo)
      .then(userAuth => {
        console.log({ userAuth })
      })
      .catch(err => {
        console.error( err )
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
