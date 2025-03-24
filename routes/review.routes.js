import { Router } from "express";


const reviewRoutes =Router()

reviewRoutes.get('/',getAllReviews)
reviewRoutes.get('/:id',getReviewById)
reviewRoutes.post('/',createreview)
reviewRoutes.put('/:id',updateReview)
