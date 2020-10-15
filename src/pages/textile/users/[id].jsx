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
    getUserById
} from "../../../services/users"

import {
    addTrackToCatalog,
    textileGetItemsByUserAudiusId,
    deleteItem as deleteTrack
} from '../../../services/tracks'

const TextilePage = () => {

    const router = useRouter()
    const { id } = router.query;

    const [client, setClient] = useState({})
    const [user, setUser] = useState({})

    // audiusUploads are the Textile objects in "audiusUploads" that belong to a User
    const [audiusUploads, setAudiusUploads] = useState([])

    const [itemsInYourName, setItemsInYourName] = useState([])

    const [catalog, setCatalog] = useState([])

    useEffect(() => {
        if (!!id) {
            setup()
        }
    }, [id])

    useEffect(() => {
        if (user && user.audiusId) {
            setAudiusUploads(user.audiusUploads)
            setCatalog(user.catalog)

            // Get textile items by user audius ID
            textileGetItemsByUserAudiusId(client, user.audiusId)
            .then(items => {
                setItemsInYourName(items)
            })
            .catch(console.error)
            
        }
    }, [user])

    

    const setup = async () => {
        const [
            client,
        ] = await loginAndSetupDB({ newIdentity : false })
        setClient(client)

        // Setup users docs
        try {
            const user = await getUserById(client, id)
            setUser(user)
        } catch (err) { console.error(err) }
    }

    const handleAddToCatalog = async (e, audiusUpload ) => {
        e.preventDefault()
        // Update user
        try {
            await addTrackToCatalog(client, audiusUpload)
            const user = await getUserById(client, id)
            setUser(user)
        } catch (err) { console.error(err) }
    }

    const handleDeleteItem = async (e, item) => {
        e.preventDefault()
        await deleteTrack(client, item)
        const items = await textileGetItemsByUserAudiusId(client, user.audiusId)
        setItemsInYourName(items)
    }
    const renderedAudiusUploads = !!audiusUploads && audiusUploads.map((audiusUpload) => (
        <>  
            <p> {audiusUpload.id}- {audiusUpload.title}</p>
            <Button onClick={e => handleAddToCatalog(e, audiusUpload)}>Add to Catalog</Button>
        </>
    ))



    const renderedItems = !!itemsInYourName && itemsInYourName.map((item) => (
        <>
        <p> {JSON.stringify(item)}</p>
        <Button onClick={e => handleDeleteItem(e, item)}>Delete from 'Items'</Button>
        </>
    ))

    const renderedCatalog = !!catalog && catalog.map((c) => (
        <p> {JSON.stringify(c)}</p>
    ))

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
                            !!Object.keys(user).length
                                ? (JSON.stringify(user))
                                : <p> Fetching User {id}... </p>
                        }
                    </Box>

                    <Box background="lime" width="100%">
                        <Heading as="h5" size="xl" marginY="2rem">
                            Your Uploads
                        </Heading>
                        {renderedAudiusUploads}
                    </Box>

                    <Box background="red" width="100%">
                        <Heading as="h5" size="xl" marginY="2rem">
                            Items from 'Items' in your name
                        </Heading>
                        {renderedItems}
                    </Box>

                    <Box background="aqua" width="100%">
                        <Heading as="h5" size="xl" marginY="2rem">
                            Your Catalog
                        </Heading>
                        {renderedCatalog}
                    </Box>

                </Flex>


            </Flex>
        </Box >
    );
};

export default TextilePage;
