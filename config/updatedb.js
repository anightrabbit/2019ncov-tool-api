const _ = require('lodash');
const axios = require('axios');

const originURL = 'https://2019ncov.nosugartech.com/data.json';
const dbURL = 'http://localhost:3000/api/2019ncov';

const fetchData = (URL) => axios.get(URL);

const update = (URL, data) => axios.post(URL, data).then(res => {
	console.log('新增的' + data.length + '条数据更新完成。。。');
}).catch(err => {
	console.log(err);
});;

const getData = async (dbURL) => {
	const originData = await fetchData(originURL);
	console.log('originData--->', originData.data.data.length);
	const dbData = await fetchData(dbURL);
	console.log('dbData--->', dbData.data.total);
	if (!dbData.data.total) {
		// 如果数据库没有数据，需要分批插入数据
		chunkData(dbURL, originData.data.data);
	} else if (originData.data.data.length > dbData.data.total) {
		const diffData = _.filter(originData.data.data, (originItem) => !_.find(dbData.data.data, (dbItem) => dbItem.id === originItem.id));
		console.log('diffData--->', diffData.length);
		update(dbURL, diffData);
	} else {
		console.log('数据已更新过。。。');
	}
}

const chunkData = (url, data) => {
	// 切割数组
	const chunkArray = _.chunk(data, 100);
	console.log('chunkArray-->', chunkArray.length);
	// 批量插入数据
	_.forEach(chunkArray, (item, index) => {
		setTimeout(() => {
			axios.post(url, item).then(()=> {
				if (index === chunkArray.length - 1) {
					console.log('全部更新完成');
				}
			});
		}, 1000);
	});
};

// 开启更新数据模式
getData(dbURL);