var express = require("express");
var app = express();
var port = 5000;
var bodyParser = require("body-parser");
var cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Grade calculator API => POST /api");
});

app.get("/api", (req, res) => {
  res.send("Grade calculator API => POST /api");
});

const gradeToNumber = (txt) => {
  if (txt === "A") return 4;
  if (txt === "B+") return 3.5;
  if (txt === "B") return 3;
  if (txt === "C+") return 2.5;
  if (txt === "C") return 2;
  if (txt === "D+") return 1.5;
  if (txt === "D") return 1;
  if (txt === "F") return 0;
  if (txt === "W") return "Withdraw";
  return 0;
};

app.post("/api", (req, res) => {
  console.log(req.body);
  const obj = req.body;

  let allCredits = 0;

  if (obj.length <= 0) {
    res.send({ credits: 0, GPA: "Please input grade" });
  } else if (obj.length === 1) {
    res.send({
      credits: obj[0].credit,
      GPA: gradeToNumber(obj[0].grade).toFixed(2),
    });
  } else {
    const result = obj.reduce((a, b, bindex) => {
      const gradeNum = gradeToNumber(b.grade);
      const creditNum = parseFloat(b.credit);
      // First itertion
      if (bindex === 1) {
        if (gradeToNumber(a.grade) === "Withdraw" && gradeNum !== "Withdraw") {
          allCredits = creditNum;
          return gradeNum * creditNum;
        } else if (
          gradeToNumber(a.grade) === "Withdraw" &&
          gradeNum === "Withdraw"
        ) {
          allCredits = 0;
          return 0;
        } else if (
          gradeToNumber(a.grade) !== "Withdraw" &&
          gradeNum === "Withdraw"
        ) {
          allCredits = parseFloat(a.credit);
          return gradeToNumber(a.grade) * parseFloat(a.credit);
        }
        allCredits = parseFloat(a.credit) + creditNum;
        return (
          gradeToNumber(a.grade) * parseFloat(a.credit) + gradeNum * creditNum
        );
      }
      // Other iteration
      else {
        if (gradeNum === "Withdraw") {
          return a;
        }
        allCredits += creditNum;
        return a + gradeNum * creditNum;
      }
    });
    res.send({ credits: allCredits, GPA: (result / allCredits).toFixed(2) });
  }
});

app.listen(port, function () {
  console.log(`Starting at http://localhost:${port}`);
});
