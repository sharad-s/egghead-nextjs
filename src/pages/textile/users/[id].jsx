import { useEffect, useState } from "react"
import NextLink from "next/link";
import { useRouter } from 'next/router'

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

import { loginAndSetupDB } from '../../../utils/setup'

// Services
import {
    createUser,
    getUserById
} from "../../../services/users"

const TextilePage = () => {

    const router = useRouter()
    const { id } = router.query;

    console.log({ id })


    const [client, setClient] = useState({})
    const [document, setDocument] = useState({})

    useEffect(() => {
        if (!!id) {
            setup({ newIdentity: false })
        }
    }, [id])

    const setup = async ({ newIdentity = false }) => {
        const [
            client,
        ] = await loginAndSetupDB({ newIdentity })
        setClient(client)

        // Setup users docs
        try {
            const user = await getUserById(client, id)
            setDocument(user)
        } catch (err) { console.error(err) }

    }

    // const handleAddDocument = async (e) => {
    //     e.preventDefault()
    //     await createUser(client)
    //     const users = await getUsers(client)
    //     setDocuments(users)
    // }

    return (
        <Box width="100%">
            <Flex margin="1rem" justifyContent="space-around">
                <NextLink href="/" passHref>
                    <Link>Home</Link>
                </NextLink>
                <NextLink href="/textile" passHref>
                    <Link>Threads Demo</Link>
                </NextLink>
                <NextLink href="/textile/users" passHref>
                    <Link>Users</Link>
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
                        Textile - User ID
                    </Heading>


                    <Box background="coral" width="100%">
                        <Heading as="h5" size="xl" marginY="2rem">
                            User ID
                        </Heading>
                        {
                            !!Object.keys(document).length
                                ? (JSON.stringify(document))
                                : <p> Fetching User {id}... </p>
                        }
                    </Box>
                </Flex>


            </Flex>
        </Box >
    );
};

export default TextilePage;
