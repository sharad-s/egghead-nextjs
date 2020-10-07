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
import { getIdentity } from '../../utils/textile'

const AboutPage = () => {

  const [identity, setIdentity] = useState({})

  useEffect(() => {
    console.log("loaded.")
    getIdentity().then(identity => {
      console.log({ identity }, identity.toString())
      setIdentity(identity)
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
        <Text>
          Identity: {identity.toString()}
        </Text>

      </Flex>
    </Box>
  );
};

export default AboutPage;
