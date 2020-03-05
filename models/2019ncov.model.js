const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NcovSchema = new Schema(
  {
    id: {
      type: Number,
    },
    t_date: {
      type: String,
    },
    t_start: {
      type: String,
    },
    t_end: {
      type: String,
    },
    t_type: {
      type: Number,
      default: 0,
    },
    t_no: {
      type: String,
    },
    t_memo: {
      type: String,
    },
    t_no_sub: {
      type: String,
    },
    t_pos_start: {
      type: String,
    },
    t_pos_end: {
      type: String,
    },
    source: {
      type: String,
    },
    who: {
      type: String,
    },
    verified: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

NcovSchema.statics = {
  findByPage({ query, pageSize, pageIndex, sortType }, cb) {
    const pagesize = parseInt(pageSize, 10);
    const pageindex = parseInt(pageIndex, 10);
    const sortOptions = {};
    if (!sortType) sortOptions.id = -1;
    else if (sortType === 1) sortOptions.id = 1;
    else if (sortType === 2) sortOptions.updated_at = -1;
    else if (sortType === 3) sortOptions.updated_at = 1;
    else if (sortType === 4) sortOptions.created_at = -1;
    else if (sortType === 5) sortOptions.created_at = 1;
    return this.find(query, {
      __v: 0,
      _id: 0,
    })
      .skip((pageindex - 1) * pagesize)
      .sort(sortOptions)
      .limit(pagesize)
      .exec(cb);
  },
};

module.exports = mongoose.model('Ncov2019', NcovSchema);