const xlsx = require('node-xlsx')

const fs = require('fs')

let province = [],
	city = [],
	area = []
fs.readdir('./excel', function (err, files) {
	if (err) {
		// console.log(err)
		return
	}
	files.forEach((file) => {
		let path = `${__dirname}/excel/${file}`
		let sheetList = xlsx.parse(path)
		// console.log(sheetList.length)
		sheetList.forEach((sheet) => {
			sheet.data.forEach((row, index) => {
				let rowIndex = index
				if (rowIndex > 1) {
					let [idx, label, value] = row
					// console.log(row)
					let data = { label, value }
					// console.log(data)
					if (value.length === 2) {
						province.push(data)
					} else if (value.length === 4) {
						let pre = value.slice(0, 2)
						let cityPos = city.find((item) => {
							return item.some((o) => o.value.slice(0, 2) === pre)
						})
						if (cityPos) {
							cityPos.push(data)
						} else {
							city.push([data])
						}
					} else {
						let pre = value.slice(0, 4)
						let areaPos = area.find((item) => {
							return item.some((o) => o.value.slice(0, 4) === pre)
						})
						if (areaPos) {
							areaPos.push(data)
						} else {
							area.push([data])
						}
					}
				}
			})
		})
	})

	function convert2Min() {
		let provinceTitle = 'var provinceData =',
			provinceBot = 'export default provinceData;'
		fs.writeFile(
			`${__dirname}/output/province.js`,
			`${provinceTitle}${JSON.stringify(province)};${provinceBot}`,
			function (err) {
				console.log(err ? err : '导出省文件成功')
			}
		)
		let cityTitle = 'var cityData ='
		cityBot = 'export default cityData;'
		fs.writeFile(
			`${__dirname}/output/city.js`,
			`${cityTitle}${JSON.stringify(city)};${cityBot}`,
			function (err) {
				console.log(err ? err : '导出市文件成功')
			}
		)
		let areaTitle = 'var areaData ='
		areaBot = 'export default areaData;'
		//处理area数据为三维树组
    let temp = [],
      targerArea = [];
		area.forEach((a) => {
			let first = a[0].value.slice(0, 2)
			let r = temp.findIndex((o) => o === first)
			if (r > -1) {
        targerArea[r].push(a)
			} else {
        temp.push(first);
        targerArea.push([a])
			}
		})
		fs.writeFile(
			`${__dirname}/output/area.js`,
			`${areaTitle}${JSON.stringify(targerArea)};${areaBot}`,
			function (err) {
				console.log(err ? err : '导出区文件成功')
			}
		)
	}

	function convert2Pc() {
		let res = []
		res = [...province]
		res.forEach((p) => {
			p.children = []
			let cityPos = city.find((item) => {
				return item.some((o) => o.value.slice(0, 2) === p.value)
			})
			if (cityPos) {
				p.children = [...cityPos]
				p.children.forEach((c) => {
					c.children = []
					let areaPos = area.find((a) => {
						return a.some((o) => o.value.slice(0, 4) === c.value)
					})
					if (areaPos) {
						c.children = [...areaPos]
					}
				})
			}
		})
		fs.writeFile(
			`${__dirname}/output/pca.js`,
			`export default options = ${JSON.stringify(res)}`,
			function (err) {
				console.log(err ? err : '导出省市区成功')
			}
		)
	}

	convert2Min()

	// convert2Pc()
})
