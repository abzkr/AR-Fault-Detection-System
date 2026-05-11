CREATE DATABASE ar_maintenance_system;
USE ar_maintenance_system;


CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);


CREATE TABLE worker (
    worker_id INT AUTO_INCREMENT PRIMARY KEY,
    worker_pass VARCHAR(100) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);


CREATE TABLE location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    name_area VARCHAR(100) NOT NULL
);


CREATE TABLE marker (
    marker_id INT AUTO_INCREMENT PRIMARY KEY,
    fault_type VARCHAR(100) NOT NULL
);


CREATE TABLE fault (
    fault_id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT,
    marker_id INT,
    description VARCHAR(255),
    severity VARCHAR(20),
    FOREIGN KEY (location_id) REFERENCES location(location_id),
    FOREIGN KEY (marker_id) REFERENCES marker(marker_id)
);


CREATE TABLE assignment (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    fault_id INT,
    worker_id INT,
    status VARCHAR(50),
    assigned_date DATE,
    FOREIGN KEY (fault_id) REFERENCES fault(fault_id),
    FOREIGN KEY (worker_id) REFERENCES worker(worker_id)
);
INSERT INTO role (role_name) VALUES
('Maintenance Engineer'),
('Technician'),
('Supervisor'),
('Security Analyst');

INSERT INTO worker (worker_pass, role_id) VALUES
('pass123', 1),
('secure456', 2),
('admin789', 3),
('cyber999', 4);

INSERT INTO location (name_area) VALUES
('Platform 1'),
('Underground Tunnel A'),
('Control Room'),
('Electrical Cabinet Zone');

INSERT INTO marker (fault_type) VALUES
('Structural Fault'),
('Electrical Fault'),
('Track Fault'),
('Safety Hazard');

INSERT INTO fault (location_id, marker_id, description, severity) VALUES
(1, 4, 'Loose platform tile', 'Low'),
(2, 1, 'Crack in tunnel wall', 'High'),
(3, 2, 'Control panel power failure', 'High'),
(4, 2, 'Exposed wiring detected', 'Medium'),
(2, 3, 'Track misalignment', 'High'),
(1, 4, 'Wet floor hazard', 'Low');

INSERT INTO assignment (fault_id, worker_id, status, assigned_date) VALUES
(1, 2, 'Pending', '2026-04-01'),
(2, 1, 'In Progress', '2026-04-02'),
(3, 1, 'Completed', '2026-04-03'),
(4, 2, 'Pending', '2026-04-04'),
(5, 3, 'In Progress', '2026-04-05'),
(6, 4, 'Under Review', '2026-04-06');