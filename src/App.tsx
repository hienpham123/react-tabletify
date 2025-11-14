import React, { useState } from "react";
import { ReactTabletify, getTheme, applyTheme, type TableTheme } from "./index";
import "./styles/table.css";
import "./styles/filter-panel.css";
import "./styles/callout.css";
import "./styles/pagination.css";

// Generate mock data with 100 items
const roles = ["Dev", "PM", "Tester", "Designer", "Manager", "Analyst", "QA", "DevOps"];
const departments = ["Engineering", "Product", "Design", "Marketing", "Sales", "Support"];
const statuses = ["Active", "Inactive", "Pending", "On Leave"];
const locations = ["New York", "San Francisco", "London", "Tokyo", "Sydney", "Berlin", "Paris", "Toronto"];
const projects = ["Project Alpha", "Project Beta", "Project Gamma", "Project Delta", "Project Echo"];
const skills = ["React", "TypeScript", "Node.js", "Python", "Java", "C++", "Go", "Rust"];

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
      location: locations[Math.floor(Math.random() * locations.length)],
      project: projects[Math.floor(Math.random() * projects.length)],
      skill: skills[Math.floor(Math.random() * skills.length)],
      experience: Math.floor(Math.random() * 15) + 1,
      joinDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      email: `user${i}@company.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    });
  }

  return data;
};

const initialData = generateMockData();

// Custom theme example - Chỉ đổi màu primary sang vàng
const yellowTheme: TableTheme = {
  mode: 'light',
  colors: {
    primary: '#ffc107', // Màu vàng (Amber)
    focus: '#ffc107', // Focus color cũng dùng vàng
    focusBorder: '#ffc107',
  },
};

// Custom theme example - Full custom theme
const customTheme: TableTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    headerBackground: '#f0f4f8',
    rowBackground: '#ffffff',
    rowBackgroundAlternate: '#f8f9fa',
    selectedRowBackground: '#e3f2fd',
    hoverRowBackground: '#f5f5f5',
    text: '#1a1a1a',
    headerText: '#1a1a1a',
    rowText: '#1a1a1a',
    border: '#e0e0e0',
    focus: '#1976d2',
    primary: '#1976d2',
  },
  spacing: {
    cellPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
  },
};

export default function App() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'yellow' | 'custom'>('light');
  const [data, setData] = useState<typeof initialData>([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading data
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(initialData);
      setLoading(false);
    }, 1000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const getCurrentTheme = (): 'light' | 'dark' | TableTheme => {
    if (themeMode === 'yellow') {
      return yellowTheme;
    }
    if (themeMode === 'custom') {
      return customTheme;
    }
    return themeMode;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>ReactTabletify Demo</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>Theme: </label>
          <select
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark' | 'yellow' | 'custom')}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="light">Light (Green)</option>
            <option value="dark">Dark</option>
            <option value="yellow">Yellow Theme</option>
            <option value="custom">Custom (Blue)</option>
          </select>
        </div>
      </div>
      <ReactTabletify
        data={data}
        loading={loading}
        columns={[
          { 
            key: "id", 
            label: "ID",
            width: "80px",
            align: "center",
            sortable: true,
            filterable: false,
            resizable: true,
            editable: false
          },
          { 
            key: "name", 
            label: "Name",
            width: "200px",
            minWidth: "150px",
            sortable: true,
            filterable: true,
            resizable: true,
            editable: true
          },
          { 
            key: "age", 
            label: "Age",
            width: "100px",
            align: "center",
            sortable: true,
            filterable: true,
            resizable: true,
            editable: true
          },
          { 
            key: "role", 
            label: "Role",
            width: "120px",
            sortable: true,
            filterable: true,
            resizable: true,
            editable: true
          },
          { 
            key: "department", 
            label: "Department",
            width: "150px",
            sortable: true,
            filterable: true,
            resizable: true
          },
          { 
            key: "status", 
            label: "Status",
            width: "120px",
            cellClassName: "status-cell",
            sortable: false,
            filterable: true,
            resizable: true
          },
          { 
            key: "salary", 
            label: "Salary",
            width: "150px",
            align: "right",
            cellStyle: { fontWeight: "600" },
            sortable: true,
            filterable: false,
            resizable: true,
            editable: true
          },
          { 
            key: "location", 
            label: "Location",
            width: "150px",
            sortable: true,
            filterable: true,
            resizable: true
          },
          { 
            key: "project", 
            label: "Project",
            width: "180px",
            sortable: true,
            filterable: true,
            resizable: true
          },
          { 
            key: "skill", 
            label: "Primary Skill",
            width: "140px",
            sortable: true,
            filterable: true,
            resizable: true
          },
          { 
            key: "experience", 
            label: "Experience (years)",
            width: "160px",
            align: "center",
            sortable: true,
            filterable: true,
            resizable: true
          },
          { 
            key: "joinDate", 
            label: "Join Date",
            width: "130px",
            sortable: true,
            filterable: true,
            resizable: true
          },
          { 
            key: "email", 
            label: "Email",
            width: "220px",
            sortable: true,
            filterable: true,
            resizable: true
          },
          { 
            key: "phone", 
            label: "Phone",
            width: "140px",
            sortable: true,
            filterable: true,
            resizable: true
          },
        ]}
        stickyHeader
        // showPagination={false}
        // groupBy="department"
        // selectionMode="multiple"
        enableRowReorder={true}
        onRowReorder={(newData, draggedItem, fromIndex, toIndex) => {
          console.log('Row reordered:', { draggedItem, fromIndex, toIndex });
          setData(newData);
        }}
        theme={getCurrentTheme()}
        showTooltip={false}
        onSelectionChanged={(selected) => console.log('Selected items:', selected)}
        onItemInvoked={(item) => console.log('Item invoked:', item)}
        onColumnHeaderClick={(column) => console.log('Column header clicked:', column.label)}
        onCellEdit={(item, columnKey, newValue, index) => {
          console.log('Cell edited:', { item, columnKey, newValue, index });
          // Update the data
          setData(prev => {
            const newData = [...prev];
            // Find the item in the data array
            const itemIndex = newData.findIndex(d => d.id === item.id || d === item);
            if (itemIndex >= 0) {
              newData[itemIndex] = { ...newData[itemIndex], [columnKey]: newValue };
            }
            return newData;
          });
        }}
        onColumnPin={(columnKey, pinPosition) => {
          console.log('Column pinned:', { columnKey, pinPosition });
        }}
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

