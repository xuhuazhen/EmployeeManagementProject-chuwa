import { AppError } from './appError.js';
import catchAsync from './catchAsync.js';

export const getAll = (Model, popOptions, selectString) =>
  catchAsync(async (req, res, next) => {
    let query = Model.find();
    if (popOptions) query = query.populate(popOptions).select(selectString);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
