
function toObjects(result) {
    if (!result || result.length === 0 || result[0].values.length === 0) return [];
    const cols = result[0].columns;
    return result[0].values.map(row => {
        const obj = {};
        cols.forEach((c, i) => { obj[c] = row[i]; });
        return obj;
    });
}

function seedProductionData(db) {
    console.log('🌱 Starting comprehensive production seed...');

    const bcrypt = require('bcryptjs');
    const hashedAdmin = bcrypt.hashSync('admin123', 10);
    const hashedPass = bcrypt.hashSync('password123', 10);

    // 0. CREATE USERS IF MISSING
    // Ensure Admin
    db.run("INSERT OR IGNORE INTO users (name, username, email, password, role, position, status) VALUES ('System Admin', 'admin', 'admin@burnoutguardian.com', ?, 'ADMIN', 'Director of People', 'active')", [hashedAdmin]);

    // Ensure Manager
    db.run("INSERT OR IGNORE INTO users (name, username, email, password, role, position, status) VALUES ('Sarah Manager', 'manager1', 'sarah@burnoutguardian.com', ?, 'MANAGER', 'Engineering Lead', 'active')", [hashedPass]);

    // Get Manager ID for employee linking
    const mgrResult = toObjects(db.exec("SELECT id FROM users WHERE username = 'manager1'"));
    const mgrId = mgrResult[0]?.id;

    // Ensure Employee
    if (mgrId) {
        db.run("INSERT OR IGNORE INTO users (name, username, email, password, role, position, status, manager_id) VALUES ('Alex Developer', 'employee1', 'alex@burnoutguardian.com', ?, 'EMPLOYEE', 'Senior Dev', 'active', ?)", [hashedPass, mgrId]);
    }

    // 1. Get IDs (Re-fetch to ensure we have them)
    // Refetch map
    const users = toObjects(db.exec("SELECT id, role, username FROM users WHERE username IN ('employee1', 'manager1')"));
    const userMap = {};
    users.forEach(u => { userMap[u.username] = u.id; });

    const emp1Id = userMap['employee1'];
    const mgr1Id = userMap['manager1'];

    if (!emp1Id || !mgr1Id) {
        console.error('❌ Could not find employee1 or manager1 for seeding.');
        return;
    }

    // 2. Add fake tasks
    const taskCount = db.exec("SELECT COUNT(*) as count FROM tasks")[0].values[0][0];
    if (taskCount === 0) {
        const fakeTasks = [
            { title: 'Neural Network Optimization', description: 'Refactor the core tensor processing units.', priority: 'High', deadline: '2026-02-20', hours: 12, status: 'In Progress' },
            { title: 'Privacy Protocol Audit', description: 'Review the new encryption standards for data at rest.', priority: 'Critical', deadline: '2026-02-15', hours: 8, status: 'Assigned' },
            { title: 'Dashboard UI Refinement', description: 'Apply the latest glassmorphism styles to the risk radar.', priority: 'Medium', deadline: '2026-02-18', hours: 6, status: 'Submitted' },
            { title: 'API Documentation', description: 'Complete the Swagger docs for the cognitive services.', priority: 'Low', deadline: '2026-02-22', hours: 4, status: 'Approved' },
            { title: 'Unit Test Coverage', description: 'Increase test coverage for the Auth module.', priority: 'Medium', deadline: '2026-02-14', hours: 5, status: 'Rejected' }
        ];

        fakeTasks.forEach(t => {
            db.run(`INSERT INTO tasks (assigned_to, assigned_by, title, description, priority, deadline, estimated_hours, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [emp1Id, mgr1Id, t.title, t.description, t.priority, t.deadline, t.hours, t.status]);
        });
        console.log('✅ Tasks seeded.');
    }

    // 3. Add Submissions
    const subCount = db.exec("SELECT COUNT(*) as count FROM task_submissions")[0].values[0][0];
    if (subCount === 0) {
        const submittedTasks = toObjects(db.exec("SELECT id, status FROM tasks WHERE assigned_to = ? AND status IN ('Submitted', 'Rejected')", [emp1Id]));
        submittedTasks.forEach((row, idx) => {
            const taskId = row.id;
            const status = row.status;
            db.run(`INSERT INTO task_submissions (task_id, user_id, completion_status, work_summary, hours_spent) 
                    VALUES (?, ?, ?, ?, ?)`,
                [taskId, emp1Id, idx % 2 === 0 ? 'Completed' : 'Partial', `This work for task #${taskId} was completed with focus and high efficiency.`, 5 + idx]);

            if (status === 'Rejected') {
                db.run("UPDATE task_submissions SET rejection_reason = ? WHERE task_id = ?", ["Please clarify the unit test coverage metrics. It seems some edge cases are missing.", taskId]);
            }
        });
        console.log('✅ Submissions seeded.');
    }

    // 4. Attendance
    const attCount = db.exec("SELECT COUNT(*) as count FROM attendance")[0].values[0][0];
    if (attCount === 0) {
        const dates = [];
        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }

        dates.forEach(d => {
            const hours = (Math.random() * 4 + 6).toFixed(1);
            db.run("INSERT INTO attendance (user_id, date, check_in, check_out, total_hours) VALUES (?, ?, '09:00', ?, ?)",
                [emp1Id, d, (15 + Math.floor(hours)) + ':30', hours]);
        });
        console.log('✅ Attendance seeded.');
    }

    // 5. Notifications
    const notifCount = db.exec("SELECT COUNT(*) as count FROM notifications")[0].values[0][0];
    if (notifCount === 0) {
        db.run("INSERT INTO notifications (user_id, message, type) VALUES (?, 'You have a new task assigned: Privacy Protocol Audit', 'info')", [emp1Id]);
        db.run("INSERT INTO notifications (user_id, message, type) VALUES (?, 'Manager approved your work on: API Documentation', 'success')", [emp1Id]);
        db.run("INSERT INTO notifications (user_id, message, type) VALUES (?, 'New Task Submission: Dashboard UI Refinement from employee1', 'insight')", [mgr1Id]);
    }

    // 6. Admin Tasks
    const adminCount = db.exec("SELECT COUNT(*) as count FROM admin_assigned_tasks")[0].values[0][0];
    if (adminCount === 0) {
        const adminResult = toObjects(db.exec("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1"));
        const adminId = adminResult[0]?.id;
        if (adminId) {
            const adminTasks = [
                { title: 'Quarterly Team Focus Review', deadline: '2026-03-01', priority: 'High', status: 'Assigned' },
                { title: 'Mandatory Mental Health Audit', deadline: '2026-02-28', priority: 'Critical', status: 'Assigned' }
            ];
            adminTasks.forEach(t => {
                db.run(`INSERT INTO admin_assigned_tasks (manager_id, assigned_by, title, deadline, priority, status) 
                        VALUES (?, ?, ?, ?, ?, ?)`,
                    [mgr1Id, adminId, t.title, t.deadline, t.priority, t.status]);
            });
            console.log('✅ Admin tasks seeded.');
        }
    }

    // 7. Cognitive Metrics (The most critical part for graphs!)
    const metricCount = db.exec("SELECT COUNT(*) as count FROM cognitive_metrics")[0].values[0][0];
    if (metricCount === 0) {
        console.log('🧠 Seeding cognitive metrics for graphs...');
        const allEmps = toObjects(db.exec("SELECT id FROM users WHERE role = 'EMPLOYEE'"));
        allEmps.forEach(emp => {
            const userId = emp.id;
            for (let i = 0; i < 14; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                for (let hour = 9; hour < 18; hour += 3) {
                    const frag = Math.floor(Math.random() * 40) + 10;
                    const stress = Math.floor(Math.random() * 50) + 20;
                    const load = Math.floor(Math.random() * 60) + 30;
                    const phase = i < 3 ? (Math.random() > 0.8 ? 2 : 1) : 1; // P1 usually, P2 occasionally

                    db.run(`INSERT INTO cognitive_metrics (user_id, date, hour, fragmentation_index, latent_stress_index, neural_load_index, burnout_phase)
                            VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [userId, dateStr, hour, frag, stress, load, phase]);
                }
            }
            // Ensure at least one recent metric has a phase 
            db.run("UPDATE users SET burnout_phase = 1 WHERE id = ?", [userId]);
        });
        console.log('✅ Cognitive metrics seeded.');
    }

    // 8. Focus Stats (For Employee Dashboard Graphs)
    const focusCount = db.exec("SELECT COUNT(*) as count FROM focus_stats")[0].values[0][0];
    if (focusCount === 0) {
        console.log('👁️ Seeding focus stats...');
        const today = new Date().toISOString().split('T')[0];
        const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

        hours.forEach(h => {
            db.run("INSERT INTO focus_stats (user_id, date, hour, keys_per_minute, mouse_distance_px, idle_minutes) VALUES (?, ?, ?, ?, ?, ?)",
                [emp1Id, today, h, Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 5000) + 1000, Math.floor(Math.random() * 15)]);
        });
        console.log('✅ Focus stats seeded.');
    }
}

module.exports = seedProductionData;
