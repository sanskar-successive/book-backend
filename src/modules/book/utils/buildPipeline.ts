import mongoose from "mongoose";
import { sortOptions } from "./constants";

type PipelineStage = mongoose.PipelineStage;

interface Query {
    [key: string]: any;
}
const buildSearchMatchStage = (searchQuery: string): PipelineStage[] => {
    return searchQuery.trim() !== ""
        ? [{ $match: { $text: { $search: searchQuery, $caseSensitive: false } } }]
        : [];
};


const buildCategoryCondition = (query: Query): PipelineStage[] => {
    const categoryToFilter = Array.isArray(query["category"])
        ? query["category"]
        : [query["category"]];

    return [{ $match: { category: { $in: categoryToFilter } } }];
};

const buildLanguageCondition = (query: Query): PipelineStage[] => {
    const languageToFilter = Array.isArray(query["language"])
        ? query["language"]
        : [query["language"]];

    return [
        {
            $match: { "moreDetails.text_language": { $in: languageToFilter } },
        },
    ];
};

const buildPriceCondition = (query: Query): PipelineStage[] => {
    const minPrice = Number(query["price.from"]);
    const maxPrice = Number(query["price.to"]);
    const conditions: PipelineStage[] = [];

    if (!isNaN(minPrice)) conditions.push({ $match: { price: { $gte: minPrice } } });
    if (!isNaN(maxPrice)) conditions.push({ $match: { price: { $lte: maxPrice } } });

    return conditions;
};

const buildRatingCondition = (query: Query): PipelineStage[] => {
    const minRating = query["rating"] === "aboveThree" ? 3 : 4;
    return [{ $match: { rating: { $gte: minRating } } }];
};

const buildSortStage = (query: Query): PipelineStage[] => {
    const sortBy = query["sortBy"];

    if (sortBy === sortOptions[1]) return [{ $sort: { price: 1 } }];
    if (sortBy === sortOptions[2]) return [{ $sort: { price: -1 } }];
    if (sortBy === sortOptions[3]) return [{ $sort: { title: 1 } }];
    if (sortBy === sortOptions[4]) return [{ $sort: { rating: -1 } }];

    return [{ $sort: { createdAt: 1 } }];
};

const buildSkipLimitStage = (query: Query): PipelineStage[] => {
    const skip = Number(query["skip"]) || 0;
    const limit = Number(query["limit"]) || 10;

    return [{ $skip: skip }, { $limit: limit }];
};

export const buildPipeline = (query: Query): PipelineStage[] => {
    let pipeline: PipelineStage[] = [];

    pipeline = pipeline.concat(buildSearchMatchStage(query["search"]));
    pipeline = pipeline.concat(buildCategoryCondition(query));
    pipeline = pipeline.concat(buildLanguageCondition(query));
    pipeline = pipeline.concat(buildPriceCondition(query));
    pipeline = pipeline.concat(buildRatingCondition(query));
    pipeline = pipeline.concat(buildSortStage(query));
    pipeline = pipeline.concat(buildSkipLimitStage(query));

    return pipeline;

};
