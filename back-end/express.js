const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "123Password!",
    database: "lian_family"
  }
});

const rawQuery = user_id => {
  return `SELECT T2.user_id, T2.emp_name
  FROM (
      SELECT
          @r AS _id,
          (SELECT @r := manager_id FROM emplist WHERE user_id = _id) AS manager_id,
          @l := @l + 1 AS lvl
      FROM
          (SELECT @r := ${user_id}, @l := 0) vars,
          emplist h
      WHERE @r <> 0) T1
  JOIN emplist T2
  ON T1._id = T2.user_id
  ORDER BY T1.lvl DESC;`;
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/get", (req, res) => {
  knex("empList")
    .select()
    .then(data =>
      Promise.all(
        data.map(el =>
          knex.raw(rawQuery(el.user_id)).then(data => {
            const newObject = Object.assign(el, {
              isReportingTo: data[0].map(el => el.emp_name)
            });
            return newObject;
          })
        )
      )
    )
    .then(result => {
      res.send(result);
    });
});

app.post("/post", (req, res) => {
  const { name, jobTitle, reportTo } = req.body;

  let insertValue = {
    emp_name: name,
    job_title: jobTitle,
    manager_id: reportTo
  };

  if (reportTo === "null") {
    insertValue = { emp_name: name, job_title: jobTitle };
  }

  console.log("express", name, jobTitle, typeof reportTo);

  if (name == null || jobTitle == null) {
    res.status(422).send("there is an empty input!");
    return;
  }

  knex("empList")
    .insert(insertValue)
    .then(() => {
      res.send(insertValue);
    })
    .catch(err => res.status(500).json(err));
});

app.put("/update/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  const { name, jobTitle, reportTo } = req.body;

  let insertValue = {
    emp_name: name,
    job_title: jobTitle
    // manager_id: reportTo
  };

  if (name == null || jobTitle == null) {
    res.status(422).send("there is an empty input!");
    return;
  }

  knex("empList")
    .where({ user_id })
    .update(insertValue)
    .then(() => {
      res.send(insertValue);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send("Name already exists");
    });
});

app.delete("/delete/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  knex("empList")
    .where({ user_id })
    .delete()
    .then(() => {
      res.send("deleted");
    })
    .catch(err => res.status(500).json(err));
});

app.listen(port, () => console.log(`listening at port ${port}`));
