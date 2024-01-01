import express from "express";
import BookController from "./book.controller";
import multer from 'multer'

const router = express.Router();

const bookController = new BookController();

// router.use(authMiddleware);
// router.use(dynamicValidationMiddleware);


const upload = multer({dest : 'uploads/'});
// router.get('/bulk-upload', upload.single('file'), bookController.bulkUpload);
// router.get('/bulk-upload', upload.single('file'), bookController.bulkTest);

router.post('/bulk-upload', upload.single('file'), bookController.bulkUsingPapaParse);



router.get("/search", bookController.search);

router.get("/books", bookController.getAll);
router.get("/books/:bookId", bookController.getById);
router.post("/books", bookController.createNew);
router.patch("/books/:bookId", bookController.update);
router.delete("/books", bookController.deleteAll);
router.delete("/books/:bookId", bookController.delete);


router.get('/bulk-uploads-list', bookController.getAllBulkUploads);
router.get('/bulk-uploads-errors/:sessionId', bookController.getBulkUploadErrorDetails);
router.delete('/bulk-uploads-list/delete', bookController.deleteBulkUploadErrors);


export default router;