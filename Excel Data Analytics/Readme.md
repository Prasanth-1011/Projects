Excel Analytics Platform
Full-stack MERN application for Excel data visualization and analytics with role-based access control.
Tech Stack
Frontend: React, Tailwind CSS, Recharts, Plotly.js, React-D3-Tree
Backend: Node.js, Express, MongoDB, JWT
Libraries: Axios, Multer, XLSX, Bcrypt

______________________________________________________________________________________________________

Features by Role
Root Admin

Activate pending admin accounts
Promote admins to root status
Revoke root privileges from admins
Delete/deactivate users
View all users and admins
Access all files and data
Monitor user activity logs
View dashboard statistics

Admin (Active)

View all users list
View all admins list
Access all uploaded Excel files
View user activity logs
Track user uploads and downloads
View system statistics
Cannot activate other admins (root only)

User

Upload Excel files (.xlsx, .xls)
View uploaded file history
Access 10 data visualizations
Download charts
Track personal statistics:

Files uploaded count
Visualizations accessed
Charts downloaded

______________________________________________________________________________________________________

10 Data Visualizations

1. Bar Chart with Filters
2. Line Chart with Drilldown
3. Scatter Plot
4. Heatmap
5. Pivot Table
6. Box Plot
7. KPI Dashboard
8. Decomposition Tree
9. Choropleth Map

______________________________________________________________________________________________________

Authentication Features

Registration:
User/Admin role selection
Username, email, password
Admin accounts start as active status "pending"

Login:
Role-based authentication
JWT token with HTTP-only cookies
Session persistence

Password Management:
Change password (after login)
Forgot password (2-step verification)
Username + email validation
Secure password reset

Admin Approval Flow:
New admins → Pending status
Intermediate page until activated
Root admin activation required
Auto-redirect after approval

File Upload:
Accepts .xlsx and .xls only
10MB file size limit
Server-side parsing with XLSX
Stores parsed JSON in MongoDB
File validation and error handling

Activity Tracking:
File uploads logged
Visualization access counted
Chart downloads tracked
Timestamp for all actions
Admin can view all user activity