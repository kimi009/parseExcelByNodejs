const xlsx = require('node-xlsx')

const fs = require('fs')

let province = [],
  city = [],
  area = []
fs.readdir('./excel', function(err, files) {
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
            city.push(data)
          } else {
            area.push(data)
          }
          // console.log(city)
        }
        // row.forEach((cell, index) => {
        //   let colIndex = index
        //   if (cell !== undefined && colIndex > 0 && rowIndex > 1) {
        //     console.log(cell)
        //   }
        // })
      })
    })
  })
  fs.writeFile(
    `${__dirname}/output/province.js`,
    JSON.stringify(province),
    function(err) {
      console.log(err)
    }
  )
  fs.writeFile(`${__dirname}/output/city.js`, JSON.stringify(city), function(
    err
  ) {
    console.log(err)
  })
  fs.writeFile(`${__dirname}/output/area.js`, JSON.stringify(area), function(
    err
  ) {
    console.log(err)
  })
})
