import BookService from "../modules/book/book.service";
import UserService from "../modules/user/user.service";

const userService = new UserService();
const bookService = new BookService();

export const resolvers = {

    Query: {
        getUsers: async () => {
            const users = await userService.getAll();
            return users;
        },

        getUser: async (parent: any, { id }: any) => {
            const user = await userService.getById(id);
            return user;
        },

        getBooks : async ()=>{
            const books = await bookService.getAll();
            return books;
        },

        getBook : async (parent:any, {id} : any)=>{
            const book = await bookService.getById(id);
            return book;
        }
    },

    Mutation: {
        createUser: async (parent: any, { firstName, lastName, email, phone, password, confirmPassword }: any) => {
            let user = {
                firstName,
                lastName,
                contact: {
                    email,
                    phone
                },
                password,
                confirmPassword
            }
            const result = await userService.createNew(user);
            return result;
        },

        updateUser: async (parent: any, { id, firstName, lastName, email, phone, password, confirmPassword }: any) => {
            let updatedUser = {
                firstName,
                lastName,
                contact: {
                    email,
                    phone
                },
                password,
                confirmPassword
            }
            const result = await userService.update(id, updatedUser);
            return result;
        },

        deleteUser: async (parent: any, { id }: any) => {
            const result = await userService.delete(id);
            return result;
        }
    }
}