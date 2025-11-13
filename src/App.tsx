import React from "react";
import { ReactTabletify } from "./components/ReactTabletify";
import "./styles/table.css";
import "./styles/filter-panel.css";
import "./styles/callout.css";
import "./styles/pagination.css";

// Generate mock data with 100 items
const roles = ["Dev", "PM", "Tester", "Designer", "Manager", "Analyst", "QA", "DevOps"];
const departments = ["Engineering", "Product", "Design", "Marketing", "Sales", "Support"];
const statuses = ["Active", "Inactive", "Pending", "On Leave"];

const generateMockData = () => {
  const data = [];
  const names = [
    "Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry",
    "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul",
    "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xavier",
    "Yara", "Zoe", "Alex", "Blake", "Casey", "Dana", "Evan", "Fiona",
    "Gavin", "Hannah", "Ian", "Julia", "Kevin", "Luna", "Mason", "Nora",
    "Owen", "Piper", "Quinn", "Riley", "Sage", "Tyler", "Vera", "Will",
    "Xara", "Yuki", "Zane", "Aria", "Ben", "Cora", "Drew", "Ella",
    "Finn", "Gia", "Hugo", "Iris", "Jake", "Kira", "Leo", "Maya",
    "Nate", "Oona", "Pax", "Rosa", "Seth", "Tara", "Uri", "Vivi",
    "Wade", "Xara", "Yael", "Zara", "Aiden", "Bella", "Cade", "Diana",
    "Eli", "Faye", "Gus", "Hope", "Ivan", "Jade", "Kai", "Lila",
    "Max", "Nina", "Omar", "Pia", "Quin", "Rex", "Sara", "Tess",
    "Udo", "Vera", "Wren", "Ximena", "Yara", "Zoe"
  ];

  for (let i = 1; i <= 100; i++) {
    data.push({
      id: i,
      name: names[i % names.length] + ` ${Math.floor(i / names.length) + 1}`,
      age: 20 + Math.floor(Math.random() * 40),
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      salary: 3000 + Math.floor(Math.random() * 7000),
    });
  }

  return data;
};

const data = generateMockData();

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>ReactTabletify Demo</h1>
      <ReactTabletify
        data={data}
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "age", label: "Age" },
          { key: "role", label: "Role" },
          { key: "department", label: "Department" },
          { key: "status", label: "Status" },
          { key: "salary", label: "Salary" },
        ]}
        itemsPerPage={10}
        // groupBy="department"
        // selectionMode="multiple"
        onSelectionChanged={(selected) => console.log('Selected items:', selected)}
        onItemInvoked={(item) => console.log('Item invoked:', item)}
        onColumnHeaderClick={(column) => console.log('Column header clicked:', column.label)}
        onRenderCell={(item, key) => {
          if (key === 'salary') {
            return `$${item.salary.toLocaleString()}`;
          }
          return String(item[key]);
        }}
      />
    </div>
  );
}

