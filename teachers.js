const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'password',
  host: '127.0.0.1',
  database: 'bootcampx',
});


const query = `
SELECT teachers.name, students.cohort_name FROM assistance_requests 
LEFT JOIN teachers ON (teachers.id=assistance_requests.teacher_id)
JOIN (
  SELECT cohorts.name AS cohort_name, students.id AS id FROM students
  JOIN cohorts ON (students.cohort_id=cohorts.id)
  WHERE cohorts.name LIKE $1
) as students ON (students.id = assistance_requests.student_id)
GROUP BY teachers.name, students.cohort_name
ORDER BY teachers.name ASC;
`
const cohortName = process.argv[2] || 'MAR12'
const values = [`%'${cohortName}'%`]

pool
  .query(query, values)
  .then((res) => {
    res.rows.forEach((teacher) => {
      console.log(`${teacher.name}: ${teacher.cohort_name}`)
    });
  })
  .catch((err) => console.error('query error', err.stack));