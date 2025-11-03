import { AppError } from './appError.js';
import catchAsync from './catchAsync.js';

export const getAll = (Model, popOptions, selectString) =>
  catchAsync(async (req, res, next) => {
    let query = Model.find();
    if (popOptions) query = query.populate(popOptions).select(selectString);
    let doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    } 

    if (Model.modelName === 'SignupToken') {
      doc = doc.map(d => {
        const res = d.toObject();
        delete res.token;
          return {
            ...res,
            link: `http://localhost:5173/signup/${d.token}`,
          };
      }); 
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

  
export const getOne = (Model, popOptions, selectString) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
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

  export const updateOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let id = req.params.id;

    const updateFields = req.body.data;
    console.log('updateOne:',  req.body.data)
    const update = {};
    if (updateFields) {
      for (const [key, value] of Object.entries(updateFields)) {
        if (typeof value === 'object' && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            if (key === 'emergencyContact' && subKey === '_id') {
              continue;
            }
            update[`${key}.${subKey}`] = subValue;
          }
        } else {
          update[key] = value;
        }
      }
    }

    let query = Model.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (popOptions) {
      query = query.populate(popOptions); // Correctly chain populate here
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    // console.log("UPDATED:", doc);

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });