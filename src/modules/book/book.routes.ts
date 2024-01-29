import express from "express";
import BookController from "./book.controller";
import multer from "multer";
import authMiddleware from "../../lib/middlewares/auth.middleware";
import dynamicValidationMiddleware from "../../lib/middlewares/dynamicValidation.middleware";
import queryValidationMiddleware from "../../lib/middlewares/queryValidation.middleware";
import paramValidationMiddleware from "../../lib/middlewares/paramValidation.middleware";

const router = express.Router();

const bookController = new BookController();

router.use(authMiddleware);

const upload = multer({ dest: "uploads/" });

router.post(
  "/bulk-upload",
  upload.single("file"),
  bookController.bulkUsingPapaParse2
);

router.use(dynamicValidationMiddleware);

/**
*   @swagger
*   /api/search:
*     get:
*       tags:
*       - "Get book based on particular query param"
*       summary: Search for books based on query parameters
*       parameters:
*         - in: query
*           name: title
*           schema:
*             type: string
*           description: Title of the book to search for
*         - in: query
*           name: category
*           schema:
*             type: string
*             enum:
*               - fiction
*               - mystery
*               - arts
*               - science
*               - romance
*               - horror
*               - religion
*               - philosophy
*               - history
*               - poetry
*               - biography
*               - technology
*           description: Category of the book
*         - in: query
*           name: author
*           schema:
*             type: string
*           description: Name of the author
*         - in: query
*           name: minRating
*           schema:
*             type: number
*           description: Minimum rating of the book
*         - in: query
*           name: minPrice
*           schema:
*             type: number
*           description: Minimum price of the book
*         - in: query
*           name: maxPrice
*           schema:
*             type: number
*           description: Maximum price of the book
*       responses:
*         '200':
*           description: Successful search
*           content:
*             application/json:
*               example:
*                 books:
*                   - title: Book 1
*                     author: Author 1
*                     category: Fiction
*                     rating: 4
*         '400':
*           description: Bad Request
*         '500':
*           description: Internal Server Error
*/

router.get("/search", queryValidationMiddleware, bookController.search);


/**
 * @swagger
 * /api/books:
 *    get:
 *      tags:
 *        - get all books
 *      summary: Return all books
 *      responses:
 *        '200':
 *          description: A list of books
 *        '404':
 *          description: Bad request
 *        '500':
 *          description: Internal server error
 */

router.get("/books", bookController.getAll);

/**
 * @swagger
 * /api/books/{bookId}:
 *   get:
 *     tags:
 *       - "Get book by id"
 *     summary: Returns a particular book.
 *     description: Returns a book matched to that id.
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "65afa7cc332f20bb6ce0a5dc"
 *     responses:
 *       '200':
 *         description: Book fetched successfully.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Internal server error.
 */

router.get("/books/:bookId", paramValidationMiddleware, bookController.getById);


/**
 * @swagger
 * /api/books:
 *     post:
 *       tags:
 *         - "Create a book"
 *       summary: Create a new book
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the book
 *                 coverImage:
 *                   type: string
 *                   description: URL of the book cover image
 *                 category:
 *                   type: string
 *                   enum:
 *                     - fiction
 *                     - mystery
 *                     - arts
 *                     - science
 *                     - romance
 *                     - horror
 *                     - religion
 *                     - philosophy
 *                     - history
 *                     - poetry
 *                     - biography
 *                     - technology
 *                   description: The category of the book
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the author
 *                     about:
 *                       type: string
 *                       description: About the author
 *                   description: Details about the author
 *                 rating:
 *                   type: number
 *                   description: The rating of the book
 *                 price:
 *                   type: number
 *                   description: The price of the book
 *                 moreDetails:
 *                   type: object
 *                   properties:
 *                     publisher:
 *                       type: string
 *                       description: The publisher of the book
 *                     firstPublished:
 *                       type: string
 *                       format: date
 *                       description: Date when the book was first published
 *                     seller:
 *                       type: string
 *                       description: The seller of the book
 *                     text_language:
 *                       type: string
 *                       enum:
 *                         - english
 *                         - hindi
 *                         - sanskrit
 *                         - telugu
 *                         - bengali
 *                         - tamil
 *                       description: The text language of the book
 *                     description:
 *                       type: string
 *                       description: Description of the book
 *                     fileSize:
 *                       type: number
 *                       description: The size of the file in bytes
 *                     pages:
 *                       type: number
 *                       description: The number of pages in the book
 *                     verified:
 *                       type: boolean
 *                       description: Whether the details are verified
 *                     edition:
 *                       type: number
 *                       description: The edition of the book
 *                   description: Additional details about the book
 *       responses:
 *         '201':
 *           description: Book created successfully
 *         '400':
 *           description: Bad Request
 *         '500':
 *           description: Internal Server Error`
 */


router.post("/books", bookController.createNew);

/**
 * @swagger
 * /api/books/{bookId}:
 *   patch:
 *     tags:
 *       - "Update a particular book by id"
 *     summary: Updates book.
 *     description: Updates a book matched to that bookId.
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "65afa7cc332f20bb6ce0a5dc"
 *     responses:
 *       '200':
 *         description: Book Updated successfully.
 *       '404':
 *         description: updation failed.
 *       '500':
 *         description: Internal server error.
 */

router.patch("/books/:bookId", paramValidationMiddleware, bookController.update);



/**
 * @swagger
 * /api/books:
 *    delete:
 *      tags:
 *        - delete all books
 *      summary: delete all books
 *      responses:
 *        '200':
 *          description: delete all books
 *        '404':
 *          description: deletion failed.
 */

router.delete("/books", bookController.deleteAll);

/**
 * @swagger
 * /api/books/{bookId}:
 *   delete:
 *     tags:
 *       - "Delete book by id"
 *     summary: Delete a book.
 *     description: Delete a book matched to that id.
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "65afa7cc332f20bb6ce0a5dc"
 *     responses:
 *       '200':
 *         description: Book deleted successfully.
 *       '404':
 *         description: Deletion failed.
 *       '500':
 *         description: Internal server error.
 */

router.delete("/books/:bookId", paramValidationMiddleware, bookController.delete);


/**
 * @swagger
 * /api/bulk-uploads-list:
 *    get:
 *      tags:
 *        - get all bulk uploads
 *      summary: Return all bulk uploads list
 *      responses:
 *        '200':
 *          description: list of all bulk uploads
 *        '404':
 *          description: Not found.
 *        '500':
 *          description: Internal server error.
 */
router.get("/bulk-uploads-list", bookController.getAllBulkUploads);

/**
 * @swagger
 * /api/bulk-uploads-errors/{sessionId}
 *   get:
 *     tags:
 *       - "Get bulk upload errors"
 *     summary: Returns all errors of a particular bulk upload.
 *     description: Returns all errors of a particular bulk upload session id.
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "fd38f401-5c1f-4a1c-a453-9dc1ae1e7921"
 *     responses:
 *       '200':
 *         description: Bulk errors fetched successfully.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/bulk-uploads-errors/:sessionId",
  bookController.getBulkUploadErrorDetails
);

/**
 * @swagger
 * /api/bulk-uploads-list/delete:
 *    delete:
 *      tags:
 *        - delete all bulk uploads data
 *      summary: delete all bulk uploads data
 *      responses:
 *        '200':
 *          description: delete all bulk uploads data
 *        '404':
 *          description: deletion failed.
 */
router.delete(
  "/bulk-uploads-list/delete",
  bookController.deleteBulkUploadErrors
);


export default router;
