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
router.use(dynamicValidationMiddleware);

const upload = multer({ dest: "uploads/" });

router.post(
  "/bulk-upload",
  upload.single("file"),
  bookController.bulkUsingPapaParse2
);

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
 */

router.get("/books", bookController.getAll);
router.get("/books/:bookId", paramValidationMiddleware, bookController.getById);
router.post("/books", bookController.createNew);
router.patch("/books/:bookId", paramValidationMiddleware, bookController.update);
router.delete("/books", bookController.deleteAll);
router.delete("/books/:bookId", paramValidationMiddleware, bookController.delete);

router.get("/bulk-uploads-list", bookController.getAllBulkUploads);
router.get(
  "/bulk-uploads-errors/:sessionId",
  bookController.getBulkUploadErrorDetails
);
router.delete(
  "/bulk-uploads-list/delete",
  bookController.deleteBulkUploadErrors
);

const checkYear = (req:any, res:any, next:any)=>{

  const {year} = req.query;

  console.log(year);
  

  if(!year){

      return res.send("year is required");
  }

  if(isNaN(year)){

      return res.send("year must be number");
  }

  if(Number(year) > 2000){

      return res.send("year must be before 2000");
  }

  next();
}

router.get('/generate', checkYear,  bookController.generateRandom);

export default router;
