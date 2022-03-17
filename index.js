var fs = require("fs");

const data = fs.readFileSync("bills/bill chart.txt", "utf-8");

console.log(data);

const convert = (data) => {
  let arrayOfLines = [];
  let count = 0;
  let prev = "";
  let pushToNextLine = false;
  let commaCounter = 0;
  let line = "";

  for (let i of data) {
    if (prev === "H" && i === "B") {
      pushToNextLine = true;
      arrayOfLines.push(line);
      line = "H";
    }
    if (prev === "," && i === "\n") {
      continue;
    }
    if (i === "H") {
      prev = "H";

      continue;
    }
    if (i == "\n") {
      line += ",";
      prev = ",";
      continue;
    }
    if (i === "\t") {
      continue;
    } else {
      line += i;
    }

    //  if(i === " "){
    //    count++;
    //  }

    prev = i;
  }

  return arrayOfLines;
};

const converted = convert(data);
console.log(converted);
const jsonData = [];
let number = 0;
console.log(converted);
for (let i of converted) {
  i = i.replace(" ouse", " house");
  i = i.replace(" ealth", " health");
  i = i.replace(" ealthcare", " Healthcare");

  number++;
  const billTitles = i.match(/^HB.*, (?=on)/g);
  let billTitle;

  const remarks = i.match(/(awaiting|passed|withdraw|consolidated).*/gim);
  let remark;
  if (remarks) {
    remark = remarks[0].trim();
  }
  if (billTitles) {
    billTitle = billTitles[0].trim();
  }
  const dates = i.match(/([/\d]{7,11})/gim);
  let firstReading;
  let secondReading;
  let thirdReading;
  // split dates according to array size
  if (dates && dates.length === 3) {
    firstReading = dates[0];
    secondReading = dates[1];
    thirdReading = dates[2];
  } else if (dates && dates.length === 2) {
    firstReading = dates[0];
    secondReading = dates[1];
  } else if (dates && dates.length === 1) {
    firstReading = dates[0];
  }

  const sponsors = i.match(/ on.* \w*, (?=[\d])/gim);
  let sponsor;

  if (sponsors) {
    sponsor = sponsors[0].trim().split(",")[0];
    sponsor = `H${sponsor}`;
  }

  const committees = i.match(
    /, (committee|tetiary|healthcare|steel|information|special|ports|basic|Agricultural|federal|justice|population|interior|defense|appropriations|commerce|ecological|police|niger|petroleum|ad hoc|navy|insurance|justice|science|internally|tertiary).*, (?=[\d\D|])/gim
  );
  let committee;
  // console.log(committees);
  if (committees) {
    committee = committees[0].split(",")[1];
  }

  // console.log(committee);

  jsonData.push({
    number,
    billTitle,
    sponsor,
    firstReading,
    secondReading,
    committeeReferred: committee,
    thirdReading,
    remark,
  });
}

console.log(jsonData);

fs.writeFileSync("bill-chart.json", JSON.stringify(jsonData));
