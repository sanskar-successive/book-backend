export const typeDefs = `#graphql

    type Query{
        getUsers: [User]
        getUser(id: ID!): User
        getBooks : [Book]
        getBook(id : ID!) : Book
    }
    type Mutation{
        createUser(firstName: String!, lastName: String, email: String!, phone : Int password: String!, confirmPassword : String!): User
        updateUser(id: ID!,firstName: String!, lastName: String, email: String!, phone : Int, password: String!, confirmPassword : String!): User
        deleteUser(id: ID!): User
    }
    type User{
        id: ID!
        firstName: String!
        lastName: String
        contact : Contact!
        password: String!
        confirmPassword : String!
    }

    type Contact {
        email : String!
        phone : Int
    }

    type Book {
        id : ID!
        title : String!,
        coverImage : String,
        price : Int!,
        rating : Int!,
        category : String!,
        author : Author!,
        moreDetails : MoreDetails!,
    }

    type Author{
        name : String!,
        about : String,
    }

    type MoreDetails{
        seller : String!,
        text_language : String!,
        description : String!,
        fileSize : Int!,
        pages : Int!,
        publisher : String!,
        firstPublished : String!,
        verified : Boolean!,
        edition : Int,
    }

    
`