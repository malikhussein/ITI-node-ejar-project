import Joi from 'joi';

export const ProductSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
  }),
  category: Joi.string().required().messages({
    'string.empty': 'CategoryID is required',
  }),
  description: Joi.string().required().min(10).messages({
    'string.empty': 'description is required',
  }),
  daily: Joi.string().required().messages({
    'string.empty': 'daily is required',
  }),

  image: Joi.string().uri().optional().messages({
    'string.uri': 'Image must be a valid URL',
  }),
});
