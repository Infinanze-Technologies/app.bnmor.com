import { CSVLink } from 'react-csv'
import React from 'react'

const players = [
  {
    name:"Tom Latham",age:29,team:"New Zealand"
  },
  {
    name:"Devon Conway",age:30,team:"New Zealand"
  },
  {
    name:"Kane Williamson",age:31,team:"New Zealand"
  },
  {
    name:"Will Young",age:29,team:"New Zealand"
  }
]

const headers = [
  {
    label:"Name",key:"name"
  },
  {
    label:"Age",key:"age"
  },
  {
    label:"Team",key:"team"
  }
]

const csvLink = {
  headers: headers,
  data: players,
  filename:"csvfile.csv"
}

function index() {
  return (
    <div>
      <CSVLink {...csvLink}>Export to CSV</CSVLink>
    </div>
  )
}

export default index