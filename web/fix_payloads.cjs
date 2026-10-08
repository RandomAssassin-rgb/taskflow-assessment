const fs = require('fs');
const path = require('path');
const d = process.cwd();

// Fix Projects.tsx
let p = fs.readFileSync(path.join(d, 'src/pages/Projects.tsx'), 'utf8');
p = p.replace("status: 'ACTIVE'", "status: 'NOT_STARTED'");
fs.writeFileSync(path.join(d, 'src/pages/Projects.tsx'), p);

// Fix Tasks.tsx
let t = fs.readFileSync(path.join(d, 'src/pages/Tasks.tsx'), 'utf8');
t = t.replace("title, description, priority, status: 'TODO'", "name: title, description, priority, status: 'PENDING'");
t = t.replace("projectId: id", "project_id: id");
t = t.replace(/projectId/g, "project_id");
t = t.replace(/task\.title/g, "task.name");
fs.writeFileSync(path.join(d, 'src/pages/Tasks.tsx'), t);

// Fix ProjectDetail.tsx
let pd = fs.readFileSync(path.join(d, 'src/pages/ProjectDetail.tsx'), 'utf8');
pd = pd.replace("title, description, priority, projectId: id, status: 'TODO'", "name: title, description, priority, project_id: id, status: 'PENDING'");
pd = pd.replace(/task\.title/g, "task.name");
fs.writeFileSync(path.join(d, 'src/pages/ProjectDetail.tsx'), pd);
console.log('Fixed properties!');
