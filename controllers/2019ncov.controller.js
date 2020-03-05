const Model = require('../models/2019ncov.model');
// res错误
const handleError = (error, res) =>
  res.send({
    code: 500,
    hasError: true,
    error,
  });
// res成功
const handleSuccess = (params, res) => {
  const result = {
    code: 200,
    ...params,
  };
  res.send(result);
};
const createHandle = async (req, res) => {
  const body = req.body;
  // 批量插入
  const record = await Model.insertMany(body);
  return !record
    ? handleError(record, res)
    : handleSuccess(
        {
          msg: '添加成功',
          // data: record,
        },
        res,
        req,
      );
};
// 创建
const createAndUpdate = async (req, res) => {
  try {
    createHandle(req, res);
  } catch (e) {
    handleError(e, res);
  }
};
// post查询 支持分页
const queryHandle = async (req, res) => {
  const option = req.query || req.body;
  const query = {};
  const pageIndex = option.pageIndex || 1;
  const pageSize = option.pageSize || 20;
  // 支持id查询
  if (option.id) {
    query.id = Number(option.id);
  }
  // 支持type查询
  if (Number(option.type)) {
    query.t_type = Number(option.type);
  }
  // 支持date产销
  if (option.date) {
    query.t_date = option.date;
  }
  // 支持关键字模糊查询
  if (option.info) {
    const reg = new RegExp(option.info, 'i');
    query.$or = [
      {
        t_no: {
          $regex: reg,
        },
      },
      {
        t_memo: {
          $regex: reg,
        },
      },
      {
        t_pos_start: {
          $regex: reg,
        },
      },
      {
        t_pos_end: {
          $regex: option.info,
          $options: '$i', // 两种书写方式
        },
      },
    ];
  }
  const total = await Model.count(query);
  Model.findByPage(
    {
      query,
      pageIndex,
      pageSize,
      sortType: Number(option.sortType),
    },
    (error, data) =>
      error
        ? handleError(error, res)
        : handleSuccess(
            {
              msg: '查询成功',
              data,
              total,
            },
            res,
            req,
          ),
  );
};
// 查询
const query = async (req, res) => {
  try {
    queryHandle(req, res);
  } catch (e) {
    handleError(e, res);
  }
};
module.exports = {
  createAndUpdate,
  query,
};