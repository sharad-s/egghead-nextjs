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

import { loginAndSetupDB } from '../../../utils/setup'

// Services
import {
    createUser,
    deleteUser,
    getUsers
} from "../../../services/users"

const TextilePage = () => {

    const [client, setClient] = useState({})
    const [documents, setDocuments] = useState([])

    // user input
    const [user, setUser] = useState({
        audiusURL: 'https://audius.co/poopyguy',
        // audiusId: 'n0r46'
    })

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setup({ newIdentity: false })
    }, [])

    const setup = async ({ newIdentity = false }) => {
        setLoading(true)
        const [
            client,
        ] = await loginAndSetupDB({ newIdentity })

        setClient(client)

        // Setup users docs
        const users = await getUsers(client)
        console.log({ users })
        setDocuments(users)
        setLoading(false)
    }

    const handleAddDocument = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            await createUser(client, user)
            const users = await getUsers(client)
            setDocuments(users)
            setLoading(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (e, document) => {
        e.preventDefault()
        try {
            setLoading(true)
            await deleteUser(client, document._id)
            const users = await getUsers(client)
            setDocuments(users)
            setLoading(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleFormUpdate = async ({ target: { name, value } }) => {
        const newUser = {
            ...user,
            [name]: value
        }
        setUser(newUser)
    }

    const renderedDocuments = (documents.length == 0)
        ? (<p>No Documents...</p>)
        : documents.map(document => (
            <>
                <li key={document._id}>
                    <NextLink href={`/textile/users/${document._id}`} passHref>
                        <Link>
                            {JSON.stringify(document)}
                        </Link>
                    </NextLink>
                </li>
                <Button onClick={(e) => handleDelete(e, document)}>Delete</Button>
                <br />

            </>
        ));


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
                        Textile Threads - User Collection
                    </Heading>


                    <Box background="coral" width="100%">
                        <Heading as="h5" size="xl" marginY="2rem">
                            Documents
                        </Heading>
                        <Flex flexDirection="column">
                            <h2> Audius ID </h2>
                            <input name="audiusURL" value={user.audiusURL} onChange={handleFormUpdate} />
                            <Button onClick={handleAddDocument}>
                                Add a User Document
                            </Button>
                        </Flex>

                        <br />
                        {loading ? <p>Loading...</p> : renderedDocuments}
                    </Box>
                </Flex>
            </Flex>
        </Box >
    );
};

export default TextilePage;
