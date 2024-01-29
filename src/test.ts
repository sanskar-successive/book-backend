  // public search = async (req: Request, res: Response) => {
  //   try {
  //     //eslint-disable-next-line
  //     const query: any = req.query;

  //     console.log("headers", req.headers);


  //     const allCategories = [
  //       "fiction",
  //       "mystery",
  //       "arts",
  //       "science",
  //       "romance",
  //       "horror",
  //       "religion",
  //       "philosophy",
  //       "history",
  //       "poetry",
  //       "biography",
  //       "technology",
  //     ];

  //     const allLanguages = [
  //       "english",
  //       "hindi",
  //       "sanskrit",
  //       "telugu",
  //       "tamil",
  //       "bengali",
  //     ];

  //     const sortOptions = [
  //       "newest",
  //       "price low to high",
  //       "price high to low",
  //       "title",
  //       "popularity",
  //     ];

  //     let pipeline: mongoose.PipelineStage[] = [];


  //     if (Object.keys(query).includes("search")) {
  //       const searchQuery: string = query["search"];


  //       if (searchQuery.trim() !== "") {


  //         if(mongoose.isValidObjectId(searchQuery)){
  //           const particularBook = await Book.find({_id: searchQuery});

  //           return res.status(200).send({books : particularBook});
  //         }

  //         pipeline.push({
  //           $match: { $text: { $search: searchQuery, $caseSensitive: false } },
  //         });
  //       }
  //     }

  //     let andConditions = [];

  //     let categoryToFilter,
  //       languageToFilter,
  //       minPrice,
  //       maxPrice,
  //       minRating,
  //       skip,
  //       limit;

  //     if (Object.keys(query).includes("category")) {
  //       if (Array.isArray(query["category"]))
  //         categoryToFilter = query["category"];
  //       else categoryToFilter = Array(query["category"]);

  //       andConditions.push({ category: { $in: categoryToFilter } });
  //     }

  //     if (Object.keys(query).includes("language")) {
  //       if (Array.isArray(query["language"]))
  //         languageToFilter = query["language"];
  //       else languageToFilter = Array(query["language"]);

  //       andConditions.push({ "moreDetails.text_language": { $in: languageToFilter } });
  //     }

  //     if (Object.keys(query).includes("price.from")) {
  //       minPrice = Number(query["price.from"]);
  //       andConditions.push({ price: { $gte: minPrice } })
  //     }

  //     if (Object.keys(query).includes("price.to")) {
  //       maxPrice = Number(query["price.to"]);
  //       andConditions.push({ price: { $lte: maxPrice } })
  //     }

  //     if (Object.keys(query).includes("rating")) {
  //       if (query["rating"] === "aboveThree") {
  //         minRating = 3;
  //       } else {
  //         minRating = 4;
  //       }
  //       andConditions.push({ rating: { $gte: minRating } })
  //     }

  //     if (andConditions.length > 0) {
  //       pipeline = pipeline.concat([
  //         {
  //           $match: {
  //             $and: andConditions
  //           }
  //         }
  //       ])
  //     }

  //     if (Object.keys(query).includes("sortBy")) {
  //       if (query["sortBy"] === sortOptions[1]) {
  //         pipeline = pipeline.concat([
  //           {
  //             $sort: { price: 1 },
  //           },
  //         ]);
  //       } else if (query["sortBy"] === sortOptions[2]) {
  //         pipeline = pipeline.concat([
  //           {
  //             $sort: { price: -1 },
  //           },
  //         ]);
  //       }
  //       if (query["sortBy"] === sortOptions[3]) {
  //         pipeline = pipeline.concat([
  //           {
  //             $sort: { title: 1 },
  //           },
  //         ]);
  //       }
  //       if (query["sortBy"] === sortOptions[4]) {
  //         pipeline = pipeline.concat([
  //           {
  //             $sort: { rating: -1 },
  //           },
  //         ]);
  //       }
  //     } else {
  //       pipeline = pipeline.concat([
  //         {
  //           $sort: { createdAt: 1 },
  //         },
  //       ]);
  //     }

  //     if (Object.keys(query).includes("skip")) {
  //       skip = Number(query["skip"]);
  //     } else {
  //       skip = 0;
  //     }

  //     if (Object.keys(query).includes("limit")) {
  //       limit = Number(query["limit"]);
  //     } else {
  //       limit = 10;
  //     }

  //     pipeline = pipeline.concat([
  //       {
  //         $skip: skip,
  //       },
  //       {
  //         $limit: limit,
  //       }
  //     ]);

  //     const [books, count] = await Promise.all([
  //       Book.aggregate(pipeline).exec(),
  //       Book.countDocuments(pipeline).exec()
  //     ]);

  //     console.log("count docs", count);


  //     res
  //       .status(200)
  //       .send({ message: "books fetched successfully", books: books, count : count });
  //   } catch (error) {
  //     res.status(404).send(error);
  //   }
  // };
