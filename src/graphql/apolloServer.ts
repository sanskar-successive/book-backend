import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typedefs";
import { resolvers } from "./resolvers";

export const createApolloServer = async () => {
    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers
    })

    await apolloServer.start();
    return apolloServer;
}
