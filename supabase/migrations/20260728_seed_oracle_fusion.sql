-- Migration Script for Oracle Certification MCQs
-- Generated automatically

BEGIN;

-- Clear existing data
DELETE FROM questions;
DELETE FROM subtopics;
DELETE FROM courses;

-- Insert Courses
INSERT INTO courses (id, name, description) VALUES (gen_random_uuid(), 'Oracle APEX on Autonomous Database', 'Oracle APEX on Autonomous Database');
INSERT INTO courses (id, name, description) VALUES (gen_random_uuid(), 'Oracle Cloud Infrastructure Foundations', 'Oracle Cloud Infrastructure Foundations');
INSERT INTO courses (id, name, description) VALUES (gen_random_uuid(), 'Oracle Cloud Infrastructure Architect Associate', 'Oracle Cloud Infrastructure Architect Associate');

-- Insert Subtopics
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Compute', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Migrate Workloads to OCI', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Implementing Navigation in your Application', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Autonomous Database', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'OCI Introduction', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Design And Deploy OCI Virtual Cloud Networks (VCN)', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Implement, and Operate Secure OCI Networking and Connectivity Solutions', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'IAM Overview', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Implementing Security in your Application', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Networking – DNS Management', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'DevOps Introduction', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'DevSecOps', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Object Storage – Basics', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Networking – Load Balancer', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Networking – Network Command Center', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Security', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Autonomous Database on Shared Infrastructure', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Object Storage – Advanced', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Networking – Connectivity', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Transitive Routing', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Developing Reports', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Processes and Validations', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Compute – Advanced', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Observability Services', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Autonomous Database Tools', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Microservices and Containerization', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Managing Application Data', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Getting Started with Autonomous Database', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Networking – Virtual Cloud Network', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'OCI DevOps Project: Continuous Integration and Continuous Delivery (CI/CD)', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Networking', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Creating a Database Application', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Using SQL Workshop', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Adding Additional Pages to your Application', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Block Storage – Advanced', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'File Storage – Basics', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'VCN Gateways', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Autonomous Database Dedicated', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Migration', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Managing and Customising Interactive Reports', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Storage', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Identity and Access Management – Basics', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Creating and Using Forms', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Identity and Access Management (IAM)', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Kubernetes Basics', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Block Storage – Basics', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Compute – Basics', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Managing Cards, Faceted Search, and Smart Filters', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Plan and Design OCI Networking Solutions and App Services', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Creating Application Page Controls', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Creating and Using Dynamic Actions', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'File Storage - Advanced', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Migrating Application Development Between Environments', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Extending Application Capabilities', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Identity and Access Management – Advanced', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Using Themes, Theme Styles and Templates', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Networking – IP Management', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'OCI Networking Best Practices', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Design for Hybrid Networking Architectures', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Managing and Monitoring Autonomous Database', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle APEX on Autonomous Database';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Working with Pages and Regions', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Governance and Administration', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'OCI Networking, Connectivity and Troubleshooting Tools', 0);
END $$;
DO $$
DECLARE
  c_id UUID;
BEGIN
  SELECT id INTO c_id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate';
  INSERT INTO subtopics (id, course_id, name, order_index) VALUES (gen_random_uuid(), c_id, 'Developing on Autonomous Database', 0);
END $$;

-- Insert Questions
DO $$
DECLARE
  s_id UUID;
BEGIN
  SELECT id INTO s_id FROM subtopics WHERE name = 'Autonomous Database' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two are true about Oracle APEX?', '["Requires no additional client software. A web browser is the app development IDE.", "Is declarative. It requires no code generation.", "Requires developers to be proficient in Java, Python and other programming languages.", "Performs the data processing in a middle-tier server"]'::jsonb, '[0, 1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You can create an APEX workspace and build APEX apps on which of the following platforms?', '["Oracle Autonomous Cloud", "Oracle XE", "Amazon RDS", "Microsoft Azure", "All of the above"]'::jsonb, '[4]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three are the main components of APEX workspace homepage?', '["SQL Workshop", "App Builder", "Gallery", "RESTful Services"]'::jsonb, '[0, 1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two among the following are TRUE about Low Code Apps?', '["Provide Rich Functionality with Less Code", "Expensive", "Scalable", "Not Mobile Friendly"]'::jsonb, '[0, 2]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Using SQL Workshop' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which component in SQL Workshop allows you to build queries graphically without manual SQL coding?', '["Quick SQL", "SQL commands", "Query Builder", "Data Workshop"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'From SQL Workshop, you can perform which two of the following actions?', '["Create an APEX user", "Run SQL commands and scripts", "Create and view database objects", "Delete database"]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Answered Incorrectly What three are the result of the following QuickSQL shorthand notation do? departments /insert 4  name /nn  location  country', '["Create the departments table with 4 columns", "Creates an id column as a primary key", "Create the departments table with 3 columns", "Inserts 4 rows of random data into the departments table"]'::jsonb, '[0, 1, 3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Using Data Workshop, you can perform which three tasks:', '["Delete data from the database", "Load vast amount of data into the database", "Load data using various file formats such as XLSX, CSV, XML, and JSON", "Export vast amount of data from the database into a file"]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Creating a Database Application' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Using the App Builder component, you can perform which three tasks?', '["Install a sample App", "Create a new App", "Edit pages in the page designer", "Run SQL scripts and commands"]'::jsonb, '[0, 1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the two correct statements about PWA.', '["Provides a customizable offline page when users are offline and cannot request the network.", "Enables users to install the application on devices", "To download the app as PWA, one must visit the App Store", "An exisitng APEX app cannot be made a PWA"]'::jsonb, '[0, 1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Answered Incorrectly Which three of the following options are TRUE about a page in an APEX application?', '["An APEX application can have only one page.", "To view the rendered version of the page, you run or submit it to the Oracle APEX engine.", "A page can contain buttons, page items and regions.", "A page can be viewed and edited in the Page Designer."]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the two statements that are TRUE about the Universal Theme in APEX.', '["The developers must have extensive knowledge about Javascript, CSS and HTML in order to use the Universal Theme.", "Responsive UI", "Easy customization", "Not designed to work on tablets"]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the three correct options in the given friendly URL syntax: https://example.com:5500/ ords/r/mycompany/hr-app/update-employees?session=13766599855150', '["update-employees is the PL/SQL procedure to update the employee details.", "mycompany is the path-prefix which is by default the workspace name", "13766599855150 is the session ID. A new ID is generated for each session.", "hr-app is the application alias."]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Working with Pages and Regions' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the three different ways in which you can add a checkbox to a page.', '["Add a checkbox from the Property Editor", "Drag and drop the checkbox item into the Layout pane", "Right click Body in the Rendering Tree and add a New Page Item as Checkbox Type.", "Use the context sensitive menu in the Gallery pane."]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Choose from the following the different kinds of page components you can create in APEX.', '["Interactive Grid", "Smart Filters", "Search Page", "Faceted Search", "All of them"]'::jsonb, '[4]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'When a button is pressed, an overlay window is positioned within the viewport. What kind of page mode is it?', '["Normal Page", "Modal Dialog", "Help Page", "Non-Modal Dialog"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'The Page Designer Toolbar allows you to perform which two of the following actions?', '["Delete the application", "Navigate to Shared Components", "Export the application", "Create a new page"]'::jsonb, '[1, 3]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Developing Reports' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'I want to hide a few columns in my interactive report. To do so, which option should I choose from the Actions menu?', '["Format", "Data", "Columns", "Filter"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two of the following capabilities are TRUE for both Interactive Report and Interactive Grid?', '["End user can rearrange the report interactively using the mouse.", "End user can save the report", "End user can customize how and what data is displayed.", "End user can add, modify, and refresh data directly on the report."]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Answered Incorrectly In a Classic Report, an end user can perform which one of the following actions?', '["Rearrange the columns in the report.", "Filter values of a column in the report.", "Create Control Breaks in the report.", "Sort the columns of the report."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You can create a report in which of the three following methods?', '["Create a report as a new page in an application", "Create a report from Object Browser", "Create a report region on a page in an application", "Create a report when you create a new database application"]'::jsonb, '[0, 2, 3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two types of pages behave similarly in functionality?', '["Smart Filter", "Cards", "Faceted Search", "Map"]'::jsonb, '[0, 2]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Managing and Customising Interactive Reports' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the two options provided in a Column Heading menu of an Interactive Report.', '["Group By", "Delete", "Control Break", "Hide"]'::jsonb, '[2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'To highlight certain rows in the interactive report based on a condition, you must:', '["Edit the rows in the report and select a color", "Rows cannot be highlighted in an Interactive report", "Provide a conditional SQL query", "Choose a condition in Format &gt; Highlight"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Answered Incorrectly Choose the three types of aggregations you can apply on a column.', '["Count", "Sum", "Average", "Standard Deviation"]'::jsonb, '[0, 1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two of the following types can an end user save the customized Interactive report as?', '["A private report", "Cannot save the report", "A Public report", "Default report"]'::jsonb, '[0, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the two statements that are TRUE about an Interactive Report. As a developer:', '["You can customize the pagination", "You can modify the data in the report after running the app", "You cannot modify the report source query", "You can customize the Actions menu to include or exclude certain options."]'::jsonb, '[0, 3]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Creating Application Page Controls' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Choose from the below options the actions that can be performed when a button is clicked.', '["All of them", "Redirect to a page in the same application", "Redirect to a page in a different application", "Submit Page", "Redirect to a URL"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the three types of page items that can be placed on a page.', '["Global variable", "Checkbox", "Select List", "Date Picker"]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What are the three types of List of Values(LOV) you can create on a page?', '["Cascading LOV", "Static LOV", "Dynamic LOV", "Popup LOV"]'::jsonb, '[0, 1, 2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Let''s say that there are two select lists on a page. Making a selection in the DEPARTMENT select list, determines which individuals display in the Employees select list. This type of LOV is called:', '["Dynamic LOV", "Popup LOV", "Static LOV", "Cascading LOV"]'::jsonb, '[3]'::jsonb, 'Correct Enhancing your application using Computations,', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Processes and Validations' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'A Page Computation can be created from which two of the following tabs?', '["Dynamic Actions", "Shared Components", "Rendering Tree", "Processing"]'::jsonb, '[2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Consider a customers report. A customer name is clicked in the report to display the Customer Details form. When the items in the form dialog are updated and the user clicks Apply Changes, the page process is executed and the items from the page are used to update and commit the underlying table in the Oracle Database. What are the two types of events that occurred in this scenario?', '["Page Rendering", "Page Validation", "Page Refresh", "Page Processing"]'::jsonb, '[0, 3]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'When you run an application, the APEX engine relies on which two processes?', '["Validate Page", "Run Page", "Accept page", "Show Page"]'::jsonb, '[2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'When you click a Customer Name in the Customers report, the Customer Details form dialog page is displayed. What are the events that occur in this scenario?', '["Page Rendering", "Page rendering and processing", "Page Processing", "Page compilation"]'::jsonb, '[0]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Creating and Using Dynamic Actions' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are TRUE about Dynamic Actions?', '["It is not possible to debug Dynamic Actions from the Developer Toolbar", "More dynamic actions you add to a page, the greater your overall page size.", "Dynamic actions provide a way to define complex client-side behaviour declaratively without the need for JavaScript.", "Dynamic Actions require complex client side Javascript code."]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In an Employee form, the ''Commission'' and ''Hire Date'' fields are enabled only if the Job is ''Salesman''. This can be achieved by which feature of APEX?', '["PL/SQL procedure", "Conditional SQL", "Processing", "Dynamic Actions"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'To create a Dynamic Action, you need to specify which three of the following options?', '["Why the action is performed", "When the action occurs", "What elements are affected by the action", "What action or actions are performed"]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'When you create a Dynamic Action, you specify the event that causes the dynamic action to fire. Choose the categories these events are classified into.', '["Component Events", "Browser Events", "Custom Events", "All of them", "Framework Events"]'::jsonb, '[3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Migrating Application Development Between Environments' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Select the two advantages of using One-click Remote Deployment.', '["You need to access your production environment to import the app directly.", "Directly deploy your app definition along with the objects from the source system to the target system", "Simplify the process of deploying an application", "Deploy the app, and explicitly install the supporting objects in one-click."]'::jsonb, '[1, 2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What are the two primary ways to move database objects and data from one environment to another, for a single application?', '["Oracle SQL Developer", "SQL Workshop", "App Builder", "Page Designer"]'::jsonb, '[0, 1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Answered Incorrectly What three components must be considered while migrating an APEX app between environments?', '["Move the application definition and all associated files", "Move the database objects", "Move the sessions data", "Move the images"]'::jsonb, '[0, 1, 3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'While migrating apps, once the database objects are created in the target environment, you can load the data using which of the components?', '["Data Generator", "Quick SQL", "Data Workshop", "App Builder"]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Adding Additional Pages to your Application' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the three supported spatial geometry objects in Maps.', '["Bars", "Points", "Polygons", "Heat map"]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What are the three features of a calendar in APEX?', '["Reminders - Displays the reminders set by the users", "Month, Week, Day - Displays a monthly, weekly and daily view.", "Previous - Navigates to the previous month.", "Next - Navigates to the next month."]'::jsonb, '[1, 2, 3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Answered Incorrectly What are the required fields while creating a Chart in APEX?', '["Value Column", "Data Source", "Label Column", "Name", "All of them"]'::jsonb, '[4]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the three correct statements about Charts in APEX.', '["You can visualize data as bar, line, area, range, combination, scatter, bubble, polar, radar, pie, donut, funnel and more", "You can create charts without using Oracle JET", "Each Oracle JET visualization supports animation, accessibility, responsive layout, internationalization, test automation, and a range of inter activity features.", "Oracle APEX supports charts based on the Oracle JavaScript Extension Toolkit (Oracle JET) Data Visualizations."]'::jsonb, '[0, 2, 3]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Implementing Security in your Application' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which of the following are preconfigured authentication schemes?', '["LDAP Directory", "Social Sign In", "Open Door Credentials", "HTTP Header Variables", "All of them"]'::jsonb, '[4]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'When you create an Access Control Page, which three of the following Access Roles get created?', '["Administrator", "Reader", "Contributor", "Developer"]'::jsonb, '[0, 1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'The APEX engine uses which component as a key for tracking each user''s session state?', '["LDAP_USER", "APP_USER", "APEX_USER", "HTTP_USER"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'In APEX, you can choose which three of the following Authentication methods?', '["Custom Authentication Scheme", "Authorization Scheme", "No Authentication", "Built-in Authentication Scheme"]'::jsonb, '[0, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'You can apply an authorization scheme for which three of the following components?', '["A page", "An entire application", "A session", "Specific control such as region,item or button"]'::jsonb, '[0, 1, 3]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Managing Application Data' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three of the following statements are TRUE about Data Synchronization?', '["You must trigger Data Synchronization manually", "Helps in Providing efficient reporting on large data sets coming from a REST service", "APEX can create the local table based on the visible columns in the REST Data Source Data Profile.", "Data Synchronization enables developers to automatically sync the contents of a local table with the data from a REST service."]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What three are the key features of Data Load Definition?', '["The APEX_DATA_LOADING PL/SQL API is available for custom processing.", "Easy workflow for end users: upload the file, verify the preview, and load data", "Column mapping occurs at design time, removing the burden on end users.", "Only XML data format can be loaded to tables or collections"]'::jsonb, '[0, 1, 2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the three requirements for creating a REST Enabled SQL Reference.', '["Configure and enable the REST Enabled SQL service feature", "Install Oracle REST Data Services (ORDS) 19.x or later.", "Activate REST Enabled SQL for the target schema on the remote database", "Set up any remote database"]'::jsonb, '[0, 1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What three are the uses of Collections in APEX?', '["Collections can be accessed, manipulated, or processed during a user''s specific session.", "Use collections to temporarily capture one or more nonscalar Values.", "Collections enable you to store rows and columns in the current session into database tables", "You insert, update, and delete collection information using PL/SQL API APEX_COLLECTION."]'::jsonb, '[0, 1, 3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Oracle APEX provides direct integration of REST Data Sources in which of the following components?', '["Classic Reports", "Interactive Reports", "Interactive Grids", "JET Charts", "All of them"]'::jsonb, '[4]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Extending Application Capabilities' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What three are the building blocks of Approvals Component?', '["Task Details Page", "Automations", "Task Definition", "Unified Task List"]'::jsonb, '[0, 2, 3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three of the following are use cases of Automations?', '["Sending email alerts at a particular time of the week", "Approving specific requests", "Monitoring log tables and raising an alert when there is an issue", "Deleting a database record based on an end user''s request"]'::jsonb, '[0, 1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Answered Correctly What are Task definitions that exist on the application level in the Shared Components section made up of?', '["Task Settings", "Particpants", "Parameters", "Actions", "All of them"]'::jsonb, '[4]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Plug-ins can be used declaratively in which of the following components in APEX?', '["Items", "Regions", "Dynamic Actions", "Process Type", "All of them"]'::jsonb, '[4]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Using Themes, Theme Styles and Templates' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Developers can use Template Options in which of the following ways?', '["Applying different colors or accents", "Applying different spacing and padding", "Rendering buttons in different styles, with and without icons", "Displaying form fields with different alignments", "All of them"]'::jsonb, '[4]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which of the following options in the Developer Toolbar enables you to customize the look and feel of the application?', '["Customize", "Debug", "Session", "Quick Edit"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Choose the statement that is TRUE about Universal Theme.', '["Universal theme is the default theme that is shipped with Oracle APEX", "Features a responsive design and enables developers to create web applications without extensive knowledge of HTML, CSS, or JavaScript", "Uses a 12-column grid layout system for arranging components on a page.", "Ships with a variety of pre-built theme styles.", "All of them"]'::jsonb, '[4]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What are the three key features of Universal Theme?', '["Easy Customization", "Support for single theme", "Responsive Design", "Versatile UI Components"]'::jsonb, '[0, 2, 3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Implementing Navigation in your Application' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Generally, clicking on the hamburger menu in the upper-left corner of an APEX application displays a list of pages. What is this navigation called?', '["Lists", "Breadcrumbs", "Navigation Bar List", "Navigation Menu"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three statements are TRUE about Search Configuration?', '["Search Configuration is a shared component defines the data source to be searched and the way results should be displayed.", "One or more Search Configurations can be configured in a Search Page.", "Only one Search Configuration can be used in a Search Page.", "Searches can be based on Local data, APEX Lists, REST Enabled SQL Service, or REST Data Sources."]'::jsonb, '[0, 1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three statements are TRUE about Shared Components?', '["Breadcrumbs, Lists, and Navigation Bar entries are examples of shared components", "Shared components are common elements that can be displayed or applied on any page within an application", "Once you create a Shared Component, you can add them to any page within an APEX application in any workspace.", "Once you create a Shared Component, you can add them to any page within your APEX application"]'::jsonb, '[0, 1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Select the two places from where you can access the Shared Components Page?', '["SQL Workshop", "Gallery", "Application homepage", "Page Designer"]'::jsonb, '[2, 3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Creating and Using Forms' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Choose the three Form types that you can create using the Create Page wizard.', '["Master Detail", "Interactive Report", "Form", "Interactive Grid"]'::jsonb, '[0, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Consider a page in an APEX app where the Departments names with location is displayed on the left. Selecting a Department on the left will render details of the employees corresponding to that department on the right. Which kind of report/form is this?', '["Stacked Master Detail", "Side by Side Master Detail", "Interactive Report", "Cards"]'::jsonb, '[1]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Select the three ways in which you can create a Form in APEX.', '["Using Shared Components", "Create a Form region in Page Designer", "Using the Create Application Wizard", "Using the Create Page wizard"]'::jsonb, '[1, 2, 3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What are the three types of Master Detail Form you can create in APEX?', '["Two Page Drill Down", "Stacked", "One Below the other", "Side by Side"]'::jsonb, '[0, 1, 3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Managing Cards, Faceted Search, and Smart Filters' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle APEX on Autonomous Database');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three of the following statements are TRUE about Faceted Search?', '["You can create only 5 facets per page", "After the end user changes a facet, the results, dependent facets, and occurrence counts refresh immediately.", "The facets are displayed on the left and upper part of the screen", "The right side of the page features a Search Results region, which can display as a classic report or a cards report."]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Select two features of a Smart Filters Page.', '["Consists of filters at the left side and report on the right side of the page", "Consists of a single search field with filters at the top of the page and a report at the bottom", "Each filter represents the text entered by the end user in the search field", "Each filter displays as a suggestion chip with a single count of how often the specific suggestion value occurs."]'::jsonb, '[1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Select the three types of Facets you can create in APEX.', '["Text Area", "Input Field", "Range", "Checkbox Group"]'::jsonb, '[1, 2, 3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Select the three types of Card Layout you can create in APEX.', '["Vertical(Column)", "Grid", "Float", "Horizontal(Row)"]'::jsonb, '[1, 2, 3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'OCI Introduction' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about regions and availability domains is true?', '["Fault domains provide protection against failures across regions.", "All OCI regions have a single availability domain.", "All OCI regions have three availability domains.", "An OCI region has one or more availability domains."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You have subscribed to an OCI region that has one availability domain. You want to deploy a highly available application with two servers and a 2-node database. How would you place the components to maintain the high availability of the application?', '["High availability is not possible as there is only one availability domain in the region.", "Place the servers in one fault domain and the database nodes in another fault domain.", "Place one server and a DB node in one fault domain, and the second server and DB node in another fault domain.", "Place all the components in the same fault domain."]'::jsonb, '[2]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Oracle Cloud Infrastructure service is NOT intended for a multicloud solution?', '["Oracle Database Service for Azure", "Oracle MySQL HeatWave on AWS", "Oracle Roving Edge Infrastructure", "Oracle Interconnect for Azure"]'::jsonb, '[2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which capability can be used to protect against failures within an OCI availability domain?', '["Compartments", "Fault Domain", "Load Balancer", "Regions"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about OCI is NOT true?', '["A single fault domain can be associated with multiple availability domains within a region.", "An availability domain is one or more data centers located within a region.", "An OCI region is a localized geographic area.", "Availability domains do not share infrastructure, such as power, cooling, or network, within a region."]'::jsonb, '[0]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Identity and Access Management (IAM)' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'How is a resource in OCI identified?', '["With Compartment Name", "With OCID", "With Username", "With Tenancy ID"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which is NOT a component of OCI Identity and Access Management?', '["Principals", "Network Security Group", "Policies", "Federation"]'::jsonb, '[1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Identity and Access Management component helps to organize multiple users into a team?', '["Policies", "Groups", "Dynamic Groups", "Compartments"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about OCI Identity and Access Management is true?', '["It enables authentication for devices only.", "It enables authorization for on-premises users only.", "It enables you to control access for a group of users.", "It is used to protect information on devices."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about OCI compartments is NOT true?', '["A compartment is a logical collection of related resources.", "It is a best practice to create all your resources in the root compartment.", "Compartments can be nested.", "Compartments help to isolate and control access to resources."]'::jsonb, '[1]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Networking' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which VCN component blocks inbound traffic, but enables outbound traffic to the internet?', '["Dynamic Routing Gateway", "NAT Gateway", "Service Gateway", "Internet Gateway"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which component is NOT created by default with the creation of a Virtual Cloud Network?', '["Default Route Table", "Default DHCP Options", "Default Security List", "Default Local Peering Gateway"]'::jsonb, '[3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about Virtual Cloud Network (VCN) peering between two VCNs is NOT valid?', '["A VCN peering connection is a VPN-based connection.", "Peered VCNs can exist in the same OCI region.", "Peered VCNs cannot have overlapping CIDRs.", "Peered VCNs can exist in different OCI regions."]'::jsonb, '[0]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about a Virtual Cloud Network (VCN) is true?', '["A VCN can span OCI regions.", "A VCN can reside only in a single region but can span multiple availability domains.", "A VCN can have only one public subnet and more than one private subnet.", "A VCN can be used with only one instance."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which OSI layer traffic is supported by the OCI Network Load Balancer?', '["Layer 2 (Data Link)", "Layer 7 (Application)", "Layer 5 (Session)", "Layer 4 (Transport)"]'::jsonb, '[3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Compute' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the primary purpose of Oracle Cloud Infrastructure Functions?', '["To provide a managed database service.", "To deploy and manage virtual machines.", "To store and manage files.", "To execute code in response to events or HTTP requests."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two parameters can be customized when creating a flexible shape compute instance? (Select TWO)', '["Number of physical NICs", "Amount of memory", "Number of virtual NICs", "Number of OCPUs"]'::jsonb, '[1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which type of storage is associated with instances in the OCI Compute service?', '["File Storage", "Object Storage", "Block Storage", "Archive Storage"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about the working of autoscaling in an instance pool is true?', '["It automatically changes the shape of the compute instance to increase the number of OCPUs and memory.", "It can perform only metric-based autoscaling.", "It can perform only schedule-based autoscaling.", "It automatically provisions and removes instances in an instance pool."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which processor type is NOT available for the OCI Compute service?', '["AMD", "Intel", "Snapdragon", "Ampere"]'::jsonb, '[2]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Storage' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want to store the backup of a database in cloud storage for an extended period at the lowest storage cost. Which object storage tier would you use?', '["Standard", "Premium", "Infrequent Access", "Archive"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You have an extremely high-performance database workload that requires at least 90 IOPS/GB and 90,000 IOPS per volume. Which OCI Block Volume performance level can be used?', '["Lower Cost", "Balanced", "Ultra High Performance", "Higher Performance"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You have created an Object Storage bucket of Archive tier. Which statement is NOT valid for the Archive Storage tier?', '["From the time a restore request is made, it takes at most an hour to read the data.", "The Archive storage bucket can be upgraded to Standard storage.", "The default time available to download an object after restoration is 24 hours.", "The minimum duration to store objects is 90 days."]'::jsonb, '[1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In the Oracle Cloud Infrastructure Object Storage Service, what is the primary purpose of a pre-authenticated request URL?', '["To enable automatic transition of objects between storage tiers.", "To provide temporary and secure access to a specific object.", "To enable public read access to a specific object.", "To track and monitor object access and usage."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What feature of the Oracle Cloud Infrastructure Block Volume service ensures data durability and protection against hardware failures?', '["Compression", "Deduplication", "Replication", "Encryption"]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Security' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which of the following is NOT a component of the Oracle Cloud Infrastructure Vault service?', '["Master Encryption Key", "Vault", "Secret", "Database Backup"]'::jsonb, '[3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the primary purpose of the Oracle Cloud Infrastructure Vault service?', '["To enforce security best practices in designated compartments.", "To detect, assess, and remediate security risks in your cloud infrastructure.", "To provide security recommendations and insights for your cloud infrastructure.", "To store and manage encryption keys and secrets."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the primary function of a Responder in OCI Cloud Guard?', '["To identify potential issues based on rules.", "To generate compliance audit reports.", "To define the scope of resources Cloud Guard monitors.", "To take corrective action on detected problems."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the main advantage of using OCI Security Zones when deploying resources in your cloud environment?', '["Load balancing across multiple instances.", "Automatic resource scaling.", "Ensuring adherence to security best practices and policies.", "Streamlining application deployment."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In the OCI shared security responsibility model, who is responsible for securing the underlying cloud infrastructure?', '["Oracle", "The customer", "Government agencies", "Third-party vendors"]'::jsonb, '[0]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Governance and Administration' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Foundations');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In Oracle Cloud Infrastructure, what is the key difference between service limits and compartment quotas?', '["Both are set and can be modified only by Oracle.", "Service limits are user-defined for compartments, while compartment quotas are set by Oracle for a tenancy or region.", "Both apply only to specific compartments and can be modified only by the user.", "Service limits are set by Oracle for a tenancy or region, while compartment quotas are user-defined for specific compartments."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which is NOT a factor that influences pricing in Oracle Cloud Infrastructure?', '["Choice of OCI region", "Data transfer", "Services consumed", "Type of resource"]'::jsonb, '[0]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In Oracle Cloud Infrastructure, what can you set up to receive notifications when budget thresholds are reached?', '["SMS notifications", "Pager alerts", "Push notifications", "Email alerts"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which type of traffic is charged under data transfer costs in Oracle Cloud Infrastructure?', '["Ingress and egress are charged between instances in different availability domains.", "Egress to the internet is charged.", "Ingress is charged between two availability domains.", "Egress and ingress are both charged to and from the internet."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which is NOT a supported Oracle Cloud Infrastructure pricing model?', '["Bring Your Own License (BYOL)", "Pay As You Go", "Sovereign subscriptions", "Oracle Universal Credits"]'::jsonb, '[2]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'IAM Overview' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A company is setting up a new OCI environment and anticipates needing to manage a large number of users with fine-grained access control. It also plans to integrate onpremises or cloud-based Oracle and non-Oracle applications. Which OCI IAM identity domain type best meets these requirements?', '["Premium", "External User", "Free", "Oracle Apps"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In OCI IAM, which authentication method enables compute instances to access resources securely without storing credentials directly?', '["API keys", "Federated Identity", "OAuth 2.0 tokens", "Instance Principal"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In the context of OCI IAM and identity domains, what is the primary benefit of using separate domains for employees, business partners, and consumers?', '["Simplified social login integration for consumer applications", "Cost optimization", "Centralized management of all users across the organization", "Improved security and compliance by isolating access privileges for each group"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'When onboarding users to an OCI IAM identity domain, which of these methods can be leveraged?', '["Synchronization from an external directory, like Active Directory, using directory bridges", "User self-service registration", "All of the options", "Manual user creation only"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In the context of OCI IAM and role-based access control (RBAC), how are permissions assigned to users?', '["Permissions are directly assigned to individual users.", "Users inherit permissions based on their membership in groups.", "Permissions are granted based on a user''s job title.", "All users have the same base level of permissions."]'::jsonb, '[1]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Identity and Access Management – Basics' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'OCI compartment quotas has three quota policy statements: Set, Unset, and Zero. Which statement removes all access to a specific resource type within a compartment?', '["Zero", "Set", "Unset", "All statements have the same effect."]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'How many levels deep can compartments be nested within OCI?', '["Six levels", "Nesting is not supported in OCI.", "Unlimited levels", "Two levels"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In OCI IAM policies, verbs such as "inspect," "read," "use," and "manage" are used to:', '["Control the location or compartment where the policy applies.", "Assign a unique identifier for the policy.", "Define the level of permission granted on resources.", "Identify the specific resource type being accessed."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'By default, which group in the OCI default domain has full access to all OCI Cloud resources?', '["Administrator Group", "Domain Administrator Group", "Security Administrator Group", "Default User Group"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A company wants to grant a user the ability to create and manage applications within an OCI IAM identity domain, but restrict access to user accounts and security settings. Which predefined administrator role would be MOST appropriate?', '["Application Administrator", "User Administrator", "Help Desk Administrator", "Security Administrator"]'::jsonb, '[0]'::jsonb, '', 'hard');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Identity and Access Management – Advanced' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'How does a policy reference a network source to control access?', '["By referencing the network source name using request.networkSource.name", "By attaching the network source to the resource itself.", "By specifying the source IP address directly in the policy.", "By using the request.networkSource.id variable in the policy condition."]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'How does the "any" keyword function when combining multiple conditions in a policy?', '["Only the first condition within the curly braces is evaluated.", "The \"any\" keyword cannot be used with policy conditions.", "At least one condition within the curly braces must be true for the policy to be true.", "All conditions within the curly braces must be true for the policy to be true."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'When creating a dynamic group in OCI IAM, what defines the membership criteria?', '["Predefined roles assigned to the group.", "A static list of user accounts.", "Matching rules based on resource type, compartment, or OCID.", "The specific IAM policies assigned to the group."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Tag Based Access Control (TBAC) policies allow you to define conditions based on tags associated with:', '["The requesting user only.", "The target resource only.", "Both the requesting resource (group/compartment) and the target resource.", "None of the above. Tags cannot be used for conditions in TBAC."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the primary benefit of using individual permissions instead of verbs such as "manage" in OCI policies?', '["Simplify policy creation by reducing the number of statements.", "Improve policy readability by separating permissions from resource types.", "Enhance security by enforcing the principle of least privilege.", "Allow automatic assignment of user roles based on compartment location."]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Networking – Virtual Cloud Network' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which IP address is invalid?', '["10.0.0.4", "257.10.0.3", "192.168.0.3", "1.1.1.1", "172.16.0.3"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What happens if you create a VCN with the same CIDR prefix as another VCN in the same tenancy, region, and compartment?', '["Nothing. However, you will not be able to peer them.", "Nothing. However, DNS services will not allow you to create DNS zones.", "You will not be able to add subnets to this VCN.", "OCI will not allow you to create a VCN if another one already has the same CIDR Prefix."]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which gateway is not needed for communicating with resources outside of a VCN?', '["Local Peering Gateway", "Internet Gateway", "NAT Gateway", "Storage Gateway", "Service Gateway"]'::jsonb, '[3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which CIDR prefix in a VCN can allocate hosts to more resources?', '["/0", "/32", "/16", "/24", "/8"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three statements about Virtual Cloud Network (VCN) are true? (Select THREE)', '["A VCN is a software-defined network, defined in Oracle data centers.", "Each subnet in a VCN can exist in multiple availability domains.", "A VCN cannot connect to another VCN.", "A VCN can reside only in a single region.", "A VCN can reside in multiple regions."]'::jsonb, '[0, 1, 3]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Networking – IP Management' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which option correctly identifies the types of public IP addresses available in Oracle Cloud Infrastructure?', '["Dedicated and Shared", "Permanent and Temporary", "Ephemeral and Reserved", "Static and Dynamic"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which option best describes a public IP pool in Oracle Cloud Infrastructure?', '["A collection of IPv6 CIDR blocks allocated to a tenancy.", "A group of IPv6 CIDR blocks available for use by multiple tenancies.", "A set of IPv4 CIDR blocks allocated to a tenancy.", "A group of IPv4 CIDR blocks available for use by multiple tenancies."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the maximum number of private IPv4 addresses that a VNIC (Virtual Network Interface Card) can have in Oracle Cloud Infrastructure?', '["1", "Unlimited", "32", "33"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which option accurately describes the behavior of Reserved Public IP addresses in Oracle Cloud Infrastructure?', '["They can be allocated to any private IP address of a compute instance, float between instances, or be reserved for their tenancy until explicitly deleted.", "They are ephemeral in nature.", "They can only be used for a specific duration and cannot be reserved indefinitely.", "They can only be allocated to specific instances and cannot float between instances."]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is required for importing a public IPv4 CIDR block or IPv6 prefix into Oracle Cloud Infrastructure?', '["Ownership of the public IPv4 CIDR block or IPv6 prefix registered with a Domain Name Registrar.", "Ownership of the public IPv4 CIDR block or IPv6 prefix registered with a Web Hosting Provider.", "Ownership of the public IPv4 CIDR block or IPv6 prefix registered with a Regional Internet Registry (RIR).", "Ownership of the public IPv4 CIDR block or IPv6 prefix registered with a Domain Name System (DNS) Service."]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Networking – Connectivity' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Site-to-Site VPN provides two ____________.', '["Dynamic Routing Gateways", "VPN compartments", "FastConnect digital circuits", "VPN tunnels", "CPE devices"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A FastConnect Public Virtual Circuit will connect you from on-premises to ____________.', '["The Virtual Cloud Network", "The Remote Peering Connection", "The Oracle Services Network", "The Internet", "Your VPN Tunnels"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'To which OCI gateway do you attach a FastConnect virtual circuit?', '["NAT Gateway", "Local Peering Gateway", "Dynamic Routing Gateway", "Internet Gateway", "Service Gateway"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A Customer-Premises Equipment is an object that represents a ____________.', '["Compute instance", "Shared secret", "Router on the customer side", "VPN tunnel", "Digital circuit"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three resources can be attached to Dynamic Routing Gateways (DRGs)? (Select THREE)', '["Local Peering Connections", "Site-to-Site VPN IPSec Tunnels", "Remote Peering Connections", "Network Load Balancer", "Virtual Cloud Network"]'::jsonb, '[1, 2, 4]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Networking – Load Balancer' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'When you create a public load balancer, which two types of IP addresses can you select? (Select TWO)', '["Reserved IPv4 address", "Quad zero IPv4 address", "Ephemeral IPv4 address", "Listener public IPv4 address"]'::jsonb, '[0, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In a multi AD region, when selecting a public load balancer, how many AD-specific subnets do you need?', '["Only one", "What you need is VPN.", "You have to use regional subnets.", "At least two, each in different availability domains", "At least two, both in the same Availability Domain"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three must be configured for a load balancer to accept incoming traffic? (Select THREE)', '["A security list that is open on the listener port", "A route table entry pointing to the listener IP address", "SSL Certificate", "A backend set with at least one backend server", "A listener"]'::jsonb, '[0, 3, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In what type of load balancer do you NOT need to specify the bandwidth?', '["An ephemeral load balancer", "A public load balancer", "A network load balancer", "A redundant Site-to-Site VPN", "A private load balancer"]'::jsonb, '[2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three protocols are supported when you use a private network load balancer? (Select THREE)', '["SMTP", "ICMP", "TCP", "UDP", "HTTP"]'::jsonb, '[1]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Networking – DNS Management' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which DNS resolver endpoint do you need for receiving DNS queries from other VCN Resolvers?', '["A listening endpoint", "An on-premises endpoint", "A visual endpoint", "An alias endpoint", "A forwarding endpoint"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What Traffic Management Steering Policy do you need for distributing traffic over several servers to optimize performance?', '["Failover", "Geolocation", "IP Prefix Steering", "Load Balancer", "ASN Steering"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which DNS record do you use for an IPv6 Address?', '["NS Record", "A Record", "CNAME Record", "ALIAS Record", "AAAA Record"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the purpose of using private views in managing private DNS zones?', '["To logically group a set of private DNS zones", "To restrict access to specific DNS zones", "To accelerate DNS resolution for designated zones", "To encrypt DNS queries and responses"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which record do you need to take to the registrar in case you would like to delegate a DNS zone from your DNS registrar to OCI public DNS?', '["ALIAS Record", "Name Server Record", "A Record", "CNAME Record", "AAAA Record"]'::jsonb, '[1]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Networking – Network Command Center' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'How does the Network Path Analyzer (NPA) identify virtual network configuration issues impacting connectivity?', '["By sending simulated traffic to test network paths.", "By sending actual traffic to test network paths.", "By collecting and analyzing network configuration without sending actual traffic.", "By monitoring physical network infrastructure for anomalies."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What are the two types of capture filters that can be created for network monitoring?', '["Flow log capture filters and packet capture filters.", "Flow log capture filters and VTAP capture filters.", "VTAP capture filters and network capture filters.", "Flow control capture filters and traffic capture filters."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which service provides a diagram of the implemented topology of all VCNs in a selected region and tenancy?', '["Network Visualizer", "VCN Flow Logs", "Capture Filters", "Network Path Analyzer"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You can use the Inter-Region tool to estimate traffic from the Ashburn region to which region?', '["On-premises", "Within Ashburn", "Any other OCI region", "Our FastConnect partners", "Microsoft Azure"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which can serve as a target for traffic mirrored from a VTAP (Virtual Test Access Point) source?', '["A Database system", "A single Compute instance VNIC in a subnet", "A Network Load Balancer", "An Exadata VM Cluster"]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Compute – Basics' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want to connect to a Linux Instance from a UNIX-style system. Which SSH command would you use to access the instance?', '["ssh -i <public_key_file> <username>@<virtual-ip-address>", "ssh -i <public_key_file> <username>@<public-ip-address>", "ssh -i <public_key_file> <username>@<private-ip-address>", "ssh -i <private_key_file> <username>@<public-ip-address>"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which compute shape is designed for hardware-accelerated workloads?', '["Dense I/O Shapes", "Standard Shapes", "GPU Shapes", "Optimized Shapes"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want to run Oracle Cloud Infrastructure (OCI) compute virtual machine instances on dedicated servers that are single tenant and not shared with other customers. Which compute capacity type would you use?', '["Exclusive Virtual Machine Hosts", "Preemptible Instances", "Capacity Reservation", "Dedicated Virtual Machine Hosts"]'::jsonb, '[3]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about Capacity Reservations is NOT correct?', '["You can create, modify, and terminate your capacity reservation at any time.", "Capacity reservations can be shared between availability domains.", "Capacity reservations can have up to 50 capacity configurations.", "Unused reserved capacity is metered differently than used reserved capacity."]'::jsonb, '[1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You have a workload that is fault-tolerant and can withstand interruptions. Which compute capacity type would you use?', '["Instance Configuration", "Capacity Reservations", "Dedicated Virtual Machine Hosts", "Preemptible Instances"]'::jsonb, '[3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Compute – Advanced' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about the Run Command feature is NOT true?', '["On Windows instances, the script runs in a batch shell by default.", "The maximum size for a script file that you upload directly to an instance in plain text is 8 KB.", "On Linux instances, the script runs in a Bash shell by default.", "You can run commands on an instance even when the instance does not have SSH access or open inbound ports."]'::jsonb, '[1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want to encrypt and isolate in-use data and the applications processing that data. Which Oracle Cloud Infrastructure (OCI) offering would you use?', '["Confidential Computing", "Privileged Computing", "Private Computing", "Secret Computing"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about burstable instances is correct?', '["Burstable instances are charged according to the baseline OCPU.", "The baseline utilization is a fraction of each CPU core, either 50% or 75%.", "Burstable instances are designed for scenarios where an instance is not typically idle and has high CPU utilization.", "Burstable instances cost more than regular instances with the same total OCPU count."]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You have an instance that cannot be live migrated. OCI schedules a maintenance due date within 14 to 16 days and sends you a notification. What would happen if you do not proactively reboot the instance before the due date?', '["OCI will send you another notification to reboot.", "The instance is either reboot migrated or rebuilt in place for you.", "OCI will terminate the instance.", "OCI does not take any action."]'::jsonb, '[1]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two are the supported types of autoscaling you can apply to an instance pool? (Select TWO)', '["Schedule-based autoscaling", "Metric-based autoscaling", "Time-based autoscaling", "Predictive autoscaling"]'::jsonb, '[0, 1]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Object Storage – Basics' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which is NOT a valid storage tier in Object Storage service?', '["Standard", "Archive", "Infrequent Access", "Glacier"]'::jsonb, '[3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want to upload a 2 TiB object to Object Storage. You would like to have the flexibility of pausing between the uploads of individual parts and resuming the upload when your schedule allows. Which feature should you use?', '["Multipart uploads", "Split upload", "Splitpart uploads", "Simultaneous upload"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two types of object name filters are supported while configuring a lifecycle policy rule in Object Storage service? (Select TWO)', '["Filter matching", "Pattern matching", "Regex matching", "Prefix matching"]'::jsonb, '[1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want Object Storage service to monitor the data access pattern and help you reduce costs by automatically moving objects larger than 1 MiB out of the Standard tier into the more cost-effective Infrequent Access tier. Which feature should you enable?', '["Auto-Tiering", "Auto-Move", "Auto-Transition", "Auto-Change"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You would like to store some data that is seldom accessed but requires long retention periods. Which storage tier should you use to make the solution more cost effective?', '["Infrequent Access", "Archive", "Standard", "Reduced Redundancy"]'::jsonb, '[1]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Object Storage – Advanced' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which mechanism provides a way to let users access a bucket or an object without having their own credentials?', '["Pre-Authenticated Requests", "Auth Tokens", "Multipart Uploads", "API Keys"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two are valid retention rule types in Oracle Cloud Infrastructure (OCI) Object Storage? (Select TWO)', '["Unlimited", "Time-bound", "Indefinite", "Duration-bound"]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'You would like to enable Object Storage replication. Which two statements about a replication policy are correct? (Select TWO)', '["A destination bucket cannot also be a replication source.", "There can be a maximum of one replication policy per source bucket.", "Replication policy creation automatically creates a destination bucket.", "After the replication policy is created, the destination bucket remains in a writable state and you can upload objects directly to it."]'::jsonb, '[0, 1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements about object versioning are correct? (Select TWO)', '["A bucket that is versioning-enabled can have only two versions of an object.", "Object versioning is enabled at the bucket level.", "Object versioning does not increase your storage costs.", "You cannot enable versioning on a bucket with active retention rules."]'::jsonb, '[1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You have an object in a bucket. The object was last modified 4 months ago. You create a retention rule and specify a duration of 1 year. Which statement is correct?', '["You will not be able to modify or delete the object for the next 8 months.", "You will not be able to modify or delete the object for the next 12 months.", "You will be able to modify or delete the object for the next 4 months.", "You will be able to modify or delete the object for the next 12 months."]'::jsonb, '[0]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Block Storage – Basics' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three are options for access type when you attach a block volume to an instance? (Select THREE)', '["Read/Execute", "Read-only-Shareable", "Read/write", "Read/write-Shareable"]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which is NOT a block volume performance level?', '["Lower Cost", "Higher Performance", "Optimized", "Ultra High Performance"]'::jsonb, '[2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What happens when the detached volume autotuning feature is enabled and the volume is detached from the instance?', '["The Block Volume service adjusts the performance level to Higher Performance.", "The Block Volume service adjusts the performance level to Lower Cost.", "The Block Volume service adjusts the performance level to Balanced.", "The Block Volume service adjusts the performance level to Ultra High Performance."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two are options for attachment type when you attach a block volume to a VM instance? (Select TWO)', '["NFS", "iSCSI", "SMB", "Paravirtualized"]'::jsonb, '[3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want to attach a block volume to a VM instance and one of your requirements is to get better IOPS performance. Which volume attachment type would you use?', '["NFS", "iSCSI", "SMB", "Paravirtualized"]'::jsonb, '[1]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Block Storage – Advanced' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements about volume groups are correct? (Select TWO)', '["You can add up to 32 volumes in a volume group.", "Each volume can be a part of multiple volume groups.", "A volume group can include both boot volumes and block volumes.", "When you delete a volume group, the individual volumes in the group are deleted."]'::jsonb, '[0, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want to make a point-in-time disk-to-disk deep copy of an existing block volume without needing to go through the backup and restore process. What would you create?', '["A clone", "A twin", "A replica", "A prototype"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about the OCI Block Volume Cross Region Replication is NOT correct?', '["The replica in the destination region is always billed using the Block Storage Lower Cost option price.", "You can resize a volume with Cross Region Replication enabled.", "It does not cause any downtime or impact on source volumes.", "It performs ongoing automatic asynchronous replication of block volumes to other regions."]'::jsonb, '[1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements about resizing a block volume are correct? (Select TWO)', '["You can expand an existing volume in place with online resizing.", "You can increase as well as decrease the size of the volume.", "You can restore from a volume backup to a larger volume.", "You can clone an existing volume to a new, smaller volume."]'::jsonb, '[0, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You would like to make a point-in-time snapshot of the data on a block volume and later restore it as a new volume in a different availability domain within the same region. What would you create?', '["A replica", "A clone", "A backup", "A prototype"]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'File Storage – Basics' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about Oracle Cloud Infrastructure (OCI) File Storage service is correct?', '["You cannot connect to a file system from a bare metal instance.", "The File Storage service supports the Network File System version 3.0 (NFSv3) protocol.", "You cannot access a file system from outside the VCN.", "Storage provisioning is not fully managed."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about the OCI File System Export is correct?', '["Each export set contains only one export.", "You cannot delete exports in a mount target.", "The export path is the same as the client mount point path.", "You can add export options to an export to control access to the file system."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about the OCI File System Mount Target is NOT true?', '["File systems are exported through mount targets.", "You cannot reuse the same mount target to make multiple file systems available on the network.", "It provides the IP address or DNS name that is used with a unique export path to mount the file system.", "It is an NFS endpoint that is present in a VCN subnet."]'::jsonb, '[1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which component uniquely identifies the file system within the mount target, letting you associate many file systems to a single mount target?', '["Export Path", "Mount Point Paths", "Import Path", "Dump Path"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which component represents paths within a client instance to a locally accessible directory to which the remote file system is mounted?', '["Export Path", "Import Path", "Mount Point Path", "Dump Path"]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'File Storage - Advanced' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'When a clone is created, the metadata is copied from the source file system to the clone. What do we call that process?', '["Inheritance", "Dehydration", "Hydration", "Depth"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You create a file system and then add a 1 GB file. You then take a snapshot of the file system. What would be the total meteredBytes shown by the File Storage service after the hourly update cycle is complete?', '["2 GB", "0.5 GB", "1.5 GB", "1 GB"]'::jsonb, '[3]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about File System Replication is NOT correct?', '["Replication Resource is the control component of the replication process.", "Only a file system that has never been exported can be used as a target file system.", "You can replicate the data in one file system to another file system only in the same region.", "You can replicate the data in one file system to another file system in the same region or a different region."]'::jsonb, '[2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement about File System Snapshots is NOT correct?', '["Snapshots are a consistent, point-in-time view of your file systems.", "Snapshots are accessible under the root directory of the file system at .target/name.", "The File Storage service encrypts all file system and snapshot data at rest.", "You can take as many snapshots as per your requirement."]'::jsonb, '[1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which package needs to be installed on an instance to enable in-transit encryption with OCI''s File Storage service?', '["oci-growfs", "nfs-utils", "oci-fss-utils", "nfs-common"]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Design And Deploy OCI Virtual Cloud Networks (VCN)' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which RFC 1918 CIDR prefix can be used to create a Virtual Cloud Network (VCN)?', '["10.0.0.0/8", "192.168.0.0/16", "172.16.0.0/12", "0.0.0.0/0", "189.215.154.89/32", "8.8.8.8/8"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Where in Oracle Cloud Infrastructure would you find a key difference between a Network Security Group (NSG) and a Security List (SL)?', '["At the instance level within a subnet", "In the configuration of load balancers", "At the VCN level controlling traffic between subnets", "Within the Identity and Access Management (IAM) console"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is a key distinction between stateful and stateless security rules in Oracle Cloud Infrastructure?', '["Stateful rules track the state of network connections, while stateless rules do not.", "Stateless rules are only applicable to inbound traffic, whereas stateful rules apply to both inbound and outbound traffic.", "Stateless rules are more secure, providing enhanced encryption for data in transit.", "Stateful rules are defined at the VCN level, while stateless rules are defined at the subnet level."]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Oracle Cloud Infrastructure service enables an instance to connect to a Virtual Cloud Network (VCN) and determines how the instance connects with endpoints inside and outside the VCN?', '["Network Security Group", "Virtual Network Interface Card", "Subnet", "Route Table", "Internet Gateway"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In Oracle Cloud Infrastructure, which service controls the flow of traffic between different network destinations?', '["Identity and Access Management (IAM)", "The Virtual Cloud Network (VCN) Security List", "The Route Table associated with a subnet", "The Network Security Group (NSG) associated with a subnet"]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'VCN Gateways' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the primary purpose of Oracle Cloud Infrastructure (OCI) private endpoints?', '["To establish private connectivity between a VCN and Oracle Services without using the public internet", "To configure network routing between multiple Virtual Cloud Networks (VCNs)", "To enable direct internet access for resources within a VCN", "To provide secure communication between instances in different subnets within the same VCN"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Your DevOps team needs to interconnect the on-premises network to Oracle Cloud Infrastructure resources, such as a managed database that resides in a private subnet. They indicate that their budget is low and their bandwidth requirements are minimum. You decide that VPN is the best option. They provide you with their router public IP address. You need to create an object in OCI that represents this router. Which object is this?', '["Customer Premises Equipment (CPE)", "Bastion Host", "IPSec Tunnel", "Internet Gateway", "Virtual Network Interface Card (VNIC)", "Dynamic Routing Gateway (DRG)"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Oracle Cloud Infrastructure gateway is specifically designed to connect different Virtual Cloud Networks (VCNs) within the same region?', '["Internet Gateway (IGW)", "Local Peering Gateway (LPG)", "Dynamic Routing Gateway (DRG)", "Network Address Translation (NAT) Gateway"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You, as the company''s cloud architect, have been invited by the CEO to join a staff meeting. The company wants your input on interconnecting Oracle Cloud Infrastructure (OCI) with any of the below four cloud providers in London. They explain to you that they want the resources in the other cloud provider to leverage the ADW machine learning capabilities, that the connection between OCI and the other cloud provider can be provisioned as quickly as possible, and that the connection offers high bandwidth and predictable performance. Which cloud provider would you choose?', '["Digital Ocean", "IBM Cloud", "Google Cloud Platform", "Amazon Web Services"]'::jsonb, '[2]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Oracle Cloud Infrastructure gateway is a stand-alone object that can attach a Virtual Cloud Network (VCN)?', '["Network Address Translation (NAT) Gateway", "Local Peering Gateway (LPG)", "Dynamic Routing Gateway (DRG)", "Internet Gateway (IGW)"]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Plan and Design OCI Networking Solutions and App Services' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the primary function of Oracle Cloud Infrastructure (OCI) Private DNS?', '["To manage SSL certificates for secure communication within a subnet.", "To provide public domain name resolution for resources within a Virtual Cloud Network (VCN).", "To configure routing tables for private network traffic between different VCNs.", "To enable DNS resolution for resources within a VCN without exposing DNS queries to the public internet."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Assume you have provisioned an Oracle Cloud Infrastructure (OCI) Load Balancer and view it via the Web GUI. What can you use the Move Resource feature for?', '["To convert the Load Balancer to a Network Load Balancer.", "To move the Load Balancer to another region.", "To move the Load Balancer to another compartment.", "To move the Load Balancer to another subnet."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You are a network administrator configuring a critical application in Oracle Cloud Infrastructure (OCI). The application requires seamless communication over IPv6, and you need to assign your own IPv6 addresses to the resources in the OCI environment. Which OCI service should you use to manage the custom IPv6 addresses and provide routing for your setup?', '["Oracle Cloud FastConnect", "Oracle Cloud Load Balancer", "Oracle Cloud Virtual Network (VCN)", "Oracle Network Path Analyzer"]'::jsonb, '[2]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You are responsible for optimizing traffic flow in your Oracle Cloud Infrastructure (OCI) environment and want to implement Traffic Management Steering Policies to direct users to the nearest available instance. Which steering policy in Oracle Cloud Infrastructure Traffic Management should you choose for this purpose?', '["IP Prefix Steering", "Geolocation Steering", "Latency-Based Steering", "Load Balancer Steering"]'::jsonb, '[1]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three capabilities do you get with Oracle Cloud Infrastructure Public DNS? (Select THREE)', '["Create and manage zones.", "View all zones.", "Create and manage records.", "Create and manage security lists.", "Create and manage IAM policies.", "Create and manage WAF rules."]'::jsonb, '[0, 1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You are tasked with configuring a Network Load Balancer (NLB) in Oracle Cloud Infrastructure (OCI) to distribute traffic among a group of backend servers. Your backend servers are hosting a critical application that requires session persistence based on both source and destination IP addresses, source and destination ports, and protocol. Which NLB configuration option should you select to meet this requirement?', '["2-Tuple Hash", "Least Connections", "5-Tuple Hash", "IP Hash"]'::jsonb, '[2]'::jsonb, '', 'hard');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Design for Hybrid Networking Architectures' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the primary purpose of using Border Gateway Protocol (BGP) between your on-premises network and the OCI Virtual Cloud Network (VCN)?', '["To distribute IP addresses to OCI instances", "To secure network communication within the VCN", "To manage security rules for traffic ingress and egress", "To enable dynamic routing and exchange of routes between OCI and on-premises networks"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Dynamic Routing Gateway (DRG) feature involves the propagation of routes between different networks connected to the DRG?', '["Route Tables", "Equal-Cost Multi-Path Routing", "Loopback Attachments", "Route Distributions"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Dynamic Routing Gateway (DRG) feature enables active-active load balancing and failover of network traffic between your Oracle Cloud Infrastructure tenancy and your on-premises resources?', '["Equal-Cost Multi-Path Routing", "Route Tables", "Route Distributions", "Loopback Attachments"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You are designing a hybrid cloud solution that involves connecting your on-premises data center to Oracle Cloud Infrastructure (OCI) using a Dynamic Routing Gateway (DRG). For enhanced security, you want to ensure that the traffic passing through the DRG is encrypted. Which OCI service or feature should you leverage to implement encryption for the communication between your on-premises network and OCI via the DRG?', '["Oracle Cloud Site-to-Site VPN", "Oracle Cloud FastConnect", "Oracle Cloud Network Firewall", "Oracle Cloud Remote Peering Connection (RPC)"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is a key difference between FastConnect Public Peering and FastConnect Private Peering?', '["FastConnect Public Peering uses a dedicated physical connection, while FastConnect Private Peering uses a shared connection.", "FastConnect Public Peering is more cost-effective for high-traffic workloads, while FastConnect Private Peering is better suited for low-traffic scenarios.", "FastConnect Public Peering provides encryption for data in transit, while FastConnect Private Peering does not.", "FastConnect Public Peering allows access to public Oracle Cloud services, while FastConnect Private Peering provides direct access only to resources within your VCN."]'::jsonb, '[3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Transitive Routing' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Oracle Cloud Infrastructure gateway is always used in a Transitive Routing Configuration, regardless of the type deployed?', '["Services Gateway", "Local Peering Gateway", "Dynamic Routing Gateway", "NAT Gateway"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In which Transitive Routing Configuration will the route table include rules that route to a virtual network interface card?', '["Spoke Configuration", "Third-Party Appliance Configuration", "Remote Peering Connection Configuration", "Local Peering Gateway Configuration"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which DRG service provides a list of declarative statements that contain match criteria (such as an OCID) and an action for specifying how routes get imported from or exported to a DRG attachment?', '["Local Peering Attachment", "Route Tables", "Cross-Tenancy Attachments", "Route Distributions"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Fill in the blank. The priority of each statement in a route distribution is represented as a number between 1 and 65535. A lower number indicates a higher priority. When a ________ is processed, statements are applied in ascending order defined by their priority. The first rule that matches describes the action that will be taken.', '["route", "distribution", "policy", "attachment"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three OCI gateways can be leveraged for a Transitive Routing Configuration? (Select THREE)', '["Local Peering Gateway", "Internet Gateway", "NAT Gateway", "Services Gateway", "Dynamic Routing Gateway"]'::jsonb, '[0, 3, 4]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Implement, and Operate Secure OCI Networking and Connectivity Solutions' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is a key difference between the Dynamic Routing Gateway and Local Peering Gateway when implementing Cross-Tenancy Peering?', '["The Local Peering Gateway can have a Cross-Tenancy Attachment.", "The Dynamic Routing Gateway can have a Cross-Tenancy Attachment.", "The Dynamic Routing Gateway needs the acceptor to be in either tenancy.", "The Local Peering Gateway needs the requestor to be in either tenancy."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'How can you securely access resources in a private subnet using Cloud Shell when the Virtual Cloud Network is located in a region other than the home region?', '["Use a combination of a Public Network Setup and Local Peering Connection.", "Use a Network Load Balancer instead, with the listener on port 22.", "Use a combination of an Ephemeral Private Network Setup and Local Peering Connection.", "Use a combination of an Ephemeral Private Network Setup and Remote Peering Connection."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You need to access a Database Node and Virtual Machines that are placed in an isolated private subnet. This private subnet has never had any VCN gateway, and it doesn''t have one currently. What type of session can you use on an OCI Bastion that sits on another subnet within the same VCN?', '["Managed Port Session", "Managed SSH Session", "Port Forwarding Session", "Port Managed Session"]'::jsonb, '[2]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In an Oracle Cloud Infrastructure (OCI) environment, a company wants to enhance the security of its remote access to private resources within a Virtual Cloud Network (VCN). The company is considering the use of a centralized and secure gateway to access the private resources. Which OCI service is best suited for this scenario?', '["OCI Network Firewall", "Web Application Firewall", "VCN Secure Access Gateway (SAG)", "OCI Bastion"]'::jsonb, '[3]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You are responsible for managing your organization''s network security in Oracle Cloud Infrastructure (OCI). You are considering implementing OCI Network Firewall to enhance the security posture. Which statement accurately describes OCI Network Firewall?', '["OCI Network Firewall is a hardware appliance that needs to be installed on-premises to protect the organization''s network.", "OCI Network Firewall is primarily focused on monitoring network traffic.", "OCI Network Firewall is a cloud-native, stateful firewall service that allows you to define and enforce access control policies for traffic flowing in and out of your VCN.", "OCI Network Firewall is a cloud-adjacent, classful firewall service that allows you to define and enforce user access to OCI and on-premises resources."]'::jsonb, '[2]'::jsonb, '', 'hard');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Migrate Workloads to OCI' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is a good solution for moving petabyte-scale datasets from your data center to Object Storage or Archive Storage in Oracle Cloud Infrastructure?', '["Leveraging the Data Transfer Appliance for offline migration", "Leveraging the DNS Load Balancing service between on-premises and Oracle Cloud Infrastructure, gradually changing the ratio between both data centers", "Using Site-to-Site VPN between on-premises and Oracle Cloud Infrastructure, enabling ECMP for active-active configuration, and using Jumbo Frames for your MTU", "Using BYOIP for assigning your on-premises public CIDRs to equivalent resources in Oracle Cloud Infrastructure"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is a good way to receive advertisements of all Oracle Cloud Infrastructure Public CIDRs via BGP?', '["By establishing a Public Virtual Circuit between on-premises and OCI via FastConnect and connecting directly to the Oracle Services Network Edge Router", "By establishing a Private Virtual Circuit between on-premises and OCI via FastConnect and connecting directly to the Oracle Services Network Edge Router", "By establishing a Public Virtual Circuit between on-premises and OCI via the FastConnect link and connecting to the Oracle Services Network through the Service Gateway", "By establishing a Private Virtual Circuit between on-premises and OCI via the FastConnect link and connecting to the Oracle Services Network through the Service Gateway"]'::jsonb, '[0]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'OCI Networking, Connectivity and Troubleshooting Tools' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Oracle Cloud Infrastructure (OCI) tool helps identify network bottlenecks and latency issues by simulating packet flow along a specified path in your Virtual Cloud Network (VCN)?', '["OCI Network Flow Logs", "OCI Path Analyzer", "OCI Virtual Test Access Point", "OCI Network Visualizer"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the primary purpose of VCN Flow Logs in Oracle Cloud Infrastructure (OCI)?', '["To monitor the disk usage of instances within a Virtual Cloud Network (VCN)", "To track changes made to Network Security Groups and Route Tables within a Virtual Cloud Network (VCN)", "To automatically configure and manage Load Balancers for optimal traffic distribution", "To capture detailed information about the source and destination of network traffic, including IP addresses, ports, and protocols"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Why is the Oracle Cloud Infrastructure (OCI) Jovanovac Region in Serbia not listed in the Inter-Region Latency dashboard?', '["The Oracle Services Network does not reach the OCI Jovanovac region. Therefore, it is not possible to monitor the latency with the rest of the OCI regions.", "There is no such region in Oracle Cloud Infrastructure.", "This region exists within a unique realm and Oracle does not provide the tools to connect regions across a realm boundary via the OCI network backbone.", "There are no FastConnect partners in the OCI Jovanovac region."]'::jsonb, '[2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two are NOT VTAP components? (Select TWO)', '["VTAP Capture", "Capture Filter", "VTAP Source", "VTAP Target", "VTAP Filter"]'::jsonb, '[0, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'As an IT professional managing resources in Oracle Cloud Infrastructure (OCI), you are exploring tools to gain insights into your network architecture and the relationships between different components. Which option accurately describes OCI Network Visualizer?', '["OCI Network Visualizer is a tool that provides a visual representation of your VCN, including subnets, instances, and their interconnections, helping you understand and manage your network topology.", "OCI Network Visualizer is a graphical user interface for managing security groups within an OCI tenancy.", "OCI Network Visualizer is a performance monitoring tool focused on tracking the CPU and memory usage of individual instances within a Virtual Cloud Network (VCN).", "OCI Network Visualizer is a feature that automatically deploys and configures load balancers for optimal traffic distribution in your VCN."]'::jsonb, '[0]'::jsonb, '', 'hard');
  SELECT id INTO s_id FROM subtopics WHERE name = 'OCI Networking Best Practices' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Why is it a best practice to select the correct subnet type during network design?', '["Because once the subnet is created, you cannot change its type.", "Because your resources might become visible and accessible from the open internet with the default security list.", "Because the Oracle Services Network allows access into the home region only.", "Because some regions only have one availability domain."]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Virtual Cloud Network (VCN) component allows customers to implement microsegmentation?', '["Network Security Groups", "Route Tables", "Private Subnets", "Security Lists"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'What are three reasons for setting up notifications for key network events? (Select THREE)', '["Perform regular failover tests.", "Focus your troubleshooting efforts.", "Quickly audit what changes are made and who is making them.", "Minimize your downtime.", "Prevent IAM breaches to your environment."]'::jsonb, '[1, 2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is a best practice when creating a Virtual Cloud Network (VCN)?', '["Avoid BGP ASN overlaps with on-premises Local Area Networks.", "Use the VCN Wizard.", "Avoid CIDR overlaps with other VCNs or on-premises Local Area Networks.", "Create the VCN manually, avoiding the VCN Wizard."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which is a connectivity best practice for ensuring optimal connectivity between Oracle Cloud Infrastructure and on-premises?', '["Verify that ECMP is enabled for active standby connectivity.", "Perform regular failover tests.", "Verify that Dynamic Routing Gateway route tables are capturing the BGP information from on-premises.", "Use a Single FastConnect with a Site-to-Site VPN over it."]'::jsonb, '[1]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Getting Started with Autonomous Database' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which three statements are true about using Oracle Cloud Infrastructure?', '["It supports only virtual machine and bare metal DB systems.", "It supports only bare metal DB systems.", "It provides high availability and scalability.", "It supports only Exadata systems.", "It provides complete lifecycle automation.", "It enables you to run everything from small VMs to large bare metal clusters."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are true about Autonomous Transaction Processing (ATP)? (Select TWO)', '["Data is stored in row format.", "Missing indexes are detected and created.", "Data is stored in columnar format.", "Complex SQL queries are optimized."]'::jsonb, '[0, 1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which type operations are included in automated data center operations?', '["Online backups of a database", "Provisioning a database", "Patching a database", "All of these", "Automatically handling failures and errors"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two actions can be performed from the OCI Console for an Oracle Autonomous Database? (Select TWO)', '["Scale up or scale down CPU", "Scale up or scale down memory", "Increase storage allocated for database", "Increase network bandwidth"]'::jsonb, '[0, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement is true about Autonomous Data Warehouse (ADW)?', '["Response time is optimized for queries.", "Data is stored in row format.", "Data is stored in columnar format.", "Missing indexes are detected and created."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement is true about Autonomous Transaction Processing?', '["Data is stored in columnar format.", "It is used for analytic workloads.", "It is used for OLTP and mixed workloads.", "It is used with data marts and machine learning."]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Autonomous Database on Shared Infrastructure' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three capabilities of Oracle Autonomous Database can accelerate innovation? (Select THREE)', '["Provisioning of a data warehouse in seconds", "Instant scaling of storage", "Scaling of CPUs with very little downtime", "Built-in AI and ML to find patterns to identify undiscovered anomalies"]'::jsonb, '[0, 1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement is true about Notification Service?', '["It helps you broadcast messages to distributed components by using a hybridsubscribe model.", "It helps you broadcast messages to distributed components by using an Exadatasubscribe model.", "It helps you broadcast messages to distributed components using a publish-subscribe model.", "It helps you broadcast messages to distributed components by using a privatesubscribe model."]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement is true about moving Autonomous Database Resources?', '["After a resource is moved to a new compartment, inherent policies apply later and affect access to that resource.", "After a resource is moved to a new compartment, inherent policies apply immediately and affect access to that resource.", "After a resource is moved to a new tenant, inherent policies apply later and affect access to that resource.", "After a resource is moved to a new tenant, inherent policies apply immediately and affect access to that resource."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three are required for provisioning an Oracle Autonomous Database instance? (Select THREE)', '["Backup location FRA size", "Database name", "Number of tablespaces", "Workload type", "Number of CPUs"]'::jsonb, '[1, 3, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are true about a cloned Autonomous Database? (Select TWO)', '["It can contain only the metadata of the source Autonomous Database.", "It can contain only the data of the source Autonomous Database.", "It is a refreshable (read-only) clone of the source Autonomous Database.", "It is a refreshable (read-write) clone of the source Autonomous Database."]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two are required for Autonomous Database manual backups? (Select TWO)', '["The object bucket name must be in lowercase.", "The name format for the bucket in Object Storage must be backup_<databasename>.", "The object bucket name must be in uppercase.", "The name format for the bucket in Object Storage must be backup#<databasename>."]'::jsonb, '[0, 1, 3]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Autonomous Database Dedicated' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'At which three levels can you implement isolation with Autonomous Database Dedicated Deployment? (Select THREE)', '["Subnet level", "Database level", "Region level", "Container database level", "Virtual cloud network (VCN) level"]'::jsonb, '[1, 3, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Ideally, which two tasks does a Fleet Administrator perform? (Select TWO)', '["Create IAM users", "Manage Autonomous Databases", "Provision Autonomous Database instances", "Provision autonomous Exadata infrastructure", "Provision autonomous container databases"]'::jsonb, '[3, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three inputs must you provide when creating an autonomous Exadata infrastructure resource? (Select THREE)', '["VCN", "Storage", "Shape", "Availability domain"]'::jsonb, '[3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which four levels of access can be defined in policies? (Select FOUR)', '["Inspect", "Manage", "Use", "Create", "Read", "Write"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three actions can you perform from the Autonomous Container Database (CDB) details page? (Select THREE)', '["Change the backup retention policy for the CDB", "Move the CDB to a different compartment", "Change the maintenance schedule", "Stop the CDB", "Restart the CDB", "Stop the Autonomous Database"]'::jsonb, '[0, 1, 4]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Managing and Monitoring Autonomous Database' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three do you need to enter when you set up the config file by using the oci setup config command? (Select THREE)', '["User OCID", "OCI Region OCID", "Tenancy OCID", "File format of the config file", "Location of the config file"]'::jsonb, '[0, 2, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are true about REST APIs and RESTful services? (Select TWO)', '["REST APIs use only JSON for communication.", "REST stands for Representational State Transfer.", "REST APIs use the HTTP communication protocol but mainly use JSON for communication.", "RESTful services are complex when compared to traditional XML SOAP communications."]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are true about scaling on demand? (Select TWO)', '["Resizing requires a restart.", "Compute and storage must be scaled together.", "Resizing occurs instantly, and is fully online.", "You can independently scale compute or storage."]'::jsonb, '[2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are true about the OCI command-line interface (CLI)? (Select TWO)', '["It runs on Linux operating systems only.", "It calls OCI REST APIs.", "It does not use REST APIs.", "It is easy to use but involves complex installation and configuration.", "It is easy to use and lightweight to install."]'::jsonb, '[1, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What is the main use case for REST APIs?', '["Monitoring only", "Monitoring and development", "Monitoring and DevOps", "Monitoring, DevOps, and development", "DevOps only"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three statements are true about automated tuning? (Select THREE)', '["Parallel execution of queries needs to be monitored manually.", "It provides fast performance out of the box with zero tuning.", "It has built-in resource management plans.", "Partitioning is not covered as part of the automated tuning.", "It has a simple web-based monitoring console."]'::jsonb, '[1, 2, 4]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Autonomous Database Tools' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are true about built-in SQL Worksheet and Notebook? (Select TWO)', '["You can quickly start running queries with built-in web-based notebooks.", "You need to install a client query tool for PL/SQL.", "They are based on Apache Tomcat.", "There is no need to install a client query tool."]'::jsonb, '[0, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'With which does Oracle Machine Learning allow access to data in Autonomous Database?', '["Data viewing and discovery, and data ingestion and selection", "Data ingestion and selection only", "Data ingestion and selection, and data viewing and discovery", "Data ingestion and selection, data viewing and discovery, and data analysis"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two are prerequisites for connecting to an Autonomous Database by using SQL Developer? (Select TWO)', '["Private key", "Listener port number", "Credential wallet", "DB username and password", "Public key", "DB system public IP"]'::jsonb, '[2, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which three actions can a Workspace Administrator perform? (Select THREE)', '["Viewing usage reports for a workspace", "Managing user accounts", "Managing workspace-to-schema assignments", "Approving workspace requests", "Monitoring workspace activity", "Adding space to a schema"]'::jsonb, '[0, 1, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement is true about a workspace in Oracle APEX?', '["It can be associated with multiple schemas from different databases.", "It is not associated with any schemas.", "It can be associated with only one schema.", "It can be associated with multiple schemas in the same database."]'::jsonb, '[3]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Developing on Autonomous Database' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which clause is used in Property Graph query language to specify patterns?', '["Between", "Distinct", "Like", "Match"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement is true about Spatial Studio?', '["It does not need additional resources.", "It is a fully managed service available in OCI.", "It comes with an Autonomous Database at an additional cost.", "It is a self-service application to create interactive maps."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You want to move some unstructured data consisting of images and videos to Cloud Storage. Which type of storage is the most cost-effective?', '["Archive Storage", "Block Volume", "File Storage", "Object Storage"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are true about Oracle Text? (Select TWO)', '["It supports PDFs only.", "It provides full-text content searching.", "It renders search results in HTML format only.", "It combines relational content searching via SQL."]'::jsonb, '[1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements are true about Oracle Autonomous JSON Database? (Select TWO)', '["It supports MySQL-style database applications.", "It allows you to store JSON data in the database.", "It supports NoSQL-style document-centric applications.", "It does not support autoscaling."]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Migration' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'For which three cloud services does DBMS_CLOUD provide support for loading data from files to tables in Autonomous Database? (Select THREE)', '["OCI Object Storage Classic", "OCI Object Storage", "IBM Spectrum Storage", "Amazon AWS S3", "Dell EMC Elastic Cloud Storage"]'::jsonb, '[0, 1, 3]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two methods can you use to migrate an on-premises database to Oracle Autonomous Database? (Select TWO)', '["GoldenGate", "Data Pump", "RMAN", "Data Guard"]'::jsonb, '[0, 1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'What does the Database Migration service use for migration?', '["Data Guard", "Backup Cloud Module", "GoldenGate", "RMAN Backup"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which procedure do you use to load data directly into existing Autonomous Database tables?', '["DBMS_CLOUD.COPY_DATA", "DBMS_CLOUD.CREATE_EXTERNAL_TABLE", "DBMS_CLOUD.LIST_FILES", "DBMS_CLOUD.PUT_OBJECT"]'::jsonb, '[0]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'DevOps Introduction' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'As an aspiring Software Designer or Cloud Architect, you want to know more about DevOps as a Service. Which option best describes DevOps as a Service?', '["It is a service that operates two separate pipelines concurrently to support multiple development teams.", "It is a service that primarily focuses on deploying and maintaining cloud infrastructure for System Administrators.", "It is a service that provides tools and resources for various IT professionals to build and manage cloud-based systems.", "It is a CI/CD platform that enables developers to automate and streamline their software delivery life cycle."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'In software development, various models and methodologies are used to manage the software development process. DevOps is a relatively new methodology that has gained popularity due to its ability to streamline the development and deployment process. With that in mind, of which traditional software development model or methodology is DevOps considered an extension?', '["Spiral model", "Agile methodology", "Waterfall model", "Incremental and Iterative model"]'::jsonb, '[1]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A software development team has a pipeline set up for their application code, which automatically builds and tests the code on each commit. When the build and test stages are successful, the team deploys the code to a staging environment. However, the deployment to the production environment is done manually after approval from the team lead. Which DevOps practice does this scenario best represent?', '["Continuous Delivery", "Continuous Monitoring", "Continuous Testing", "Continuous Development"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which option best describes the DevOps life cycle?', '["A rapid-release, multi-phased software development life cycle (SDLC)", "Only a development process that involves heightened collaboration, culture, and communication", "A process of software coding that involves multiple phases and releases", "A staggered-release, agile process for software development"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'How do OCI DevOps Deployment pipelines reduce the risk and complexity of production applications?', '["By eliminating down time of production applications", "By scaling builds with service-managed build runners", "By reducing change-driven errors introduced by manual deployments", "By working with existing Git repositories and CI systems"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which of these is not a benefit of using DevOps as a Service on Oracle Cloud Infrastructure (OCI)?', '["Streamlined communication and collaboration between development and operations teams", "Increased manual intervention for application deployments", "Enhanced security and compliance measures for applications and infrastructure", "Reduced infrastructure and maintenance expenses due to automated provisioning and resource management"]'::jsonb, '[1]'::jsonb, '', 'medium');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Microservices and Containerization' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You work as a DevOps Engineer and are responsible for managing the container images stored in your team''s Oracle Cloud Infrastructure Registry (OCIR) repository. One of your team members accidentally deletes an important container image from the repository. You need to recover the image as soon as possible. How long do you have to undelete the image from OCIR before it is permanently deleted?', '["48 hours", "72 hours", "24 hours", "96 hours"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Consider the following structure: <region-key>.ocir.io/<tenancy-namespace>/<repo-name>:<tag> Which term best describes it?', '["Registry identifier", "Repository path", "Image path", "Region key"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which command is used to remove a Docker image?', '["docker purge", "docker delete", "docker rmi", "docker remove"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A company is experiencing performance issues with its monolithic architecture for an e-commerce website. The software development team is considering implementing a new design approach to improve performance and scalability. In the context of software architecture, what is a microservice?', '["A software framework for automating user interface testing", "A cloud-based service for testing and deploying microcode", "A style of design for enterprise systems based on a loosely coupled component architecture", "A small program that represents discrete logic that executes within a well-defined boundary on dedicated hardware"]'::jsonb, '[2]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You have created a Dockerfile for your application, and you want to convert it into a Docker image to be able to run it on a container. Which command should you use to achieve this?', '["docker build -t <image_name>:<tag_name>", "docker run -t <image_name>:<tag_name>", "docker convert -t <image_name>:<tag_name>", "docker create -t <image_name>:<tag_name>"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You have pushed a Docker image to your Container Registry repository in Oracle Cloud Infrastructure (OCI), and now you want to get that image onto your local machine so that you can run it locally. Which command should you use to achieve this?', '["docker pull <region-key>.ocir.io/<tenancy-namespace>/<repo-name>:<tag>", "docker push <region-key>.ocir.io/<tenancy-namespace>/<repo-name>:<tag>", "docker fetch <region-key>.ocir.io/<tenancy-namespace>/<repo-name>:<tag>", "docker tag <region-key>.ocir.io/<tenancy-namespace>/<repo-name>:<tag>"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'As a DevOps Engineer working on containerizing an application on the OCI platform, which two statements are FALSE about OCI Container Instances? (Select TWO)', '["The amount of time the container instance waits for the OS to shut down before powering off is managed internally.", "By default, the container can use only 50% of resources in the container instance.", "When selecting an image source for a container instance on the OCI platform, you can choose from Oracle Cloud Infrastructure Registry (also known as Container Registry). In addition to Oracle''s registry, you can also use third-party registries to select an image source for your container instance.", "While configuring container instances, you can set the environmental variables used by the container.", "You can configure the number of resources that the container consumes in absolute values or percentages."]'::jsonb, '[0, 1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'As a Cloud Engineer, you are asked to manage the OCI Container Registry, which hosts Docker container images. You are directed to delete all the images within a tenancy region that have not been pulled for over 72 hours to avoid billing charges for the storage space they consume. Which action should you perform to handle this requirement?', '["Set up a global image retention policy to delete images automatically based on selection criteria.", "Periodically delete old, unused images using the Docker CLI.", "Set up local image retention policies to delete images automatically based on selection criteria.", "For each old, unused image, select Delete Image from the Actions menu and confirm that you want to delete the image."]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'How does containerization differ from traditional virtualization in terms of resource utilization?', '["Containers provide isolation at the application level.", "Containers carry the extra baggage of a full operating system.", "Containers require setting up a separate guest OS for each application.", "Containers share the host operating system kernel, optimizing resource utilization."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which command is used to push a Docker image to a Docker registry?', '["docker build", "docker push", "docker attach", "docker send"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You are creating a Docker image for your web application. You want to specify the base image to be used as a starting point for your application''s image. Which instruction in the Dockerfile would you use to accomplish this?', '["USING", "BASE", "FROM", "ENTRYPOINT"]'::jsonb, '[2]'::jsonb, '', 'hard');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Kubernetes Basics' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which command would you use to delete a pod with the name "nginx-pod"?', '["kubectl delete nginx-pod", "kubectl remove pod nginx-pod", "kubectl delete pod nginx-pod", "kubectl destroy pod nginx-pod"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which Kubernetes command do you use to display information about the current cluster, including the cluster name, server address, and Kubernetes version?', '["kubectl describe cluster", "kubectl get cluster-info", "kubectl cluster-info", "kubectl cluster info"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Within the architecture of Kubernetes, various components collaborate to manage containerized workloads efficiently. Which component is NOT a core part of the Kubernetes architecture?', '["Docker Swarm, an alternative container orchestration platform developed by Docker Inc., distinct from the Kubernetes architecture", "Kube-proxy, responsible for network proxying and load balancing across application services", "Kubelet, responsible for communicating with the Kubernetes master and managing containers on the node", "etcd, a key-value store that Kubernetes uses for all cluster data, including configuration data and state"]'::jsonb, '[0]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which command do you use to create a new deployment named "nginx-deployment" using the nginx container image?', '["kubectl create deployment --name=nginx-deployment nginx", "kubectl deploy nginx-deployment --image=nginx", "kubectl create deployment nginx-deployment --image=nginx", "kubectl deploy --name=nginx-deployment --image=nginx"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Kubernetes is an open-source platform designed for automating the deployment, scaling, and management of containerized applications. What is the primary objective of Kubernetes?', '["Kubernetes primarily focuses on facilitating continuous integration and continuous delivery (CI/CD) pipelines, ensuring seamless integration of containerized applications into development workflows.", "Kubernetes aims to streamline the process of container orchestration, ensuring efficient deployment and management of containerized applications across a cluster of machines.", "Kubernetes focuses on providing a user-friendly interface for configuring containerized environments, enabling developers to easily define and manage their application environments.", "Kubernetes primarily emphasizes load balancing techniques to evenly distribute incoming traffic among containers running within a cluster, enhancing overall application performance."]'::jsonb, '[1]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'OCI DevOps Project: Continuous Integration and Continuous Delivery (CI/CD)' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A software development team is implementing continuous deployment for an application that has passed the pipeline''s automated tests. Which deployment strategy should they select?', '["Add checks at each commit to the main branch.", "Deliver automatically to production without stopping for approval.", "Allow users to test, promote to a staging environment, and get a manual approval.", "Semi-automated pipeline has an approval stage for offline checks."]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement is true about working with DevOps projects and environment variables?', '["Environment variables can include user-defined input but cannot be predefined on the build server.", "You can''t ever use a secret in OCI Vault as a variable due to security reasons.", "Environment variables are not defined in the build specification file, but are imported from other files when a build is triggered.", "All environment variables can be brought into later steps, but only exported variables can be brought into later build stages."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A DevOps engineer is asked to remove a stage from the build pipeline. What happens to the associated resources when the stage is removed?', '["The associated resources and the stage are both removed.", "The associated resources are removed, but the stage is still available.", "The associated resources are marked for deletion, but not deleted until manually deleted.", "The associated resources are still available, but the stage is marked for deletion."]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two statements accurately describe the Managed Build stage? (Select TWO)', '["This stage builds and tests your software with an OCI-managed build runner.", "This stage follows the build spec YAML file in your code repository.", "This stage publishes your software packages to production environments.", "This stage is not required, but if it is used in a build run, it must come before the Deliver Artifacts stage."]'::jsonb, '[0, 1]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A software development team wants to store the software application created from the build pipeline in the Oracle Cloud Infrastructure Artifact Registry. Which stage should be included in the pipeline?', '["Deliver Artifacts", "Trigger Deployment", "Wait", "Managed Build"]'::jsonb, '[0]'::jsonb, '', 'hard');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'A DevOps Engineer is asked to create an automated pipeline. Which stage should be included in the pipeline to compile and test the software application?', '["Managed Build", "Deliver Artifacts", "Wait", "Trigger Deployment"]'::jsonb, '[0]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'DevSecOps' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'XYZ Corp. wants to incorporate DevSecOps best practices into their DevOps process. Which three are best practices that XYZ Corp. should implement? (Select THREE)', '["Adhere to established security guidelines, such as the OWASP DevSecOps guideline, while developing and testing.", "Have a flat network with no segmentation or isolation, where all devices and resources are interconnected and accessible to anyone on the network.", "Incorporate role-based access control and establish roles and responsibilities for all parties involved in the development process.", "Manual execution of DevOps security processes and tools is a best practice to reduce the risk of errors and security incidents.", "Regularly scan for vulnerabilities and prioritize fixing them based on their level of severity."]'::jsonb, '[0, 2, 4]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'As a DevOps Engineer working on OCI DevOps projects for automating the software development life cycle, in which stage of the DevOps pipeline would you configure ADM?', '["Trigger stage", "Security stage", "Managed Build stage", "Deliver Artifact stage"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'ABC Inc. is reviewing their approach to security functions in the DevSecOps process. Which is the recommended approach?', '["Independent security teams separate from DevOps", "Strong governance, including the use of automated tools", "Complete reliance on cloud service providers for security", "Manual processes to ensure more control"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'Which two are NOT necessary to create a secret in the Oracle Cloud Infrastructure Vault service? (Select TWO)', '["You must have the required permissions to create and manage secrets in the Vault service.", "You must have an auth token to encrypt the secret.", "The user must create a compute instance to run the Secret service.", "You must have a Vault managed key to encrypt the secret."]'::jsonb, '[1, 2]'::jsonb, '', 'medium');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which is a measure of the severity of a software vulnerability, ranging from 0 to 10, and is used by ADM?', '["National Vulnerability Database (NVD)", "Vulnerability Audit", "Common Vulnerability Scoring System (CVSS)", "Knowledge Base"]'::jsonb, '[2]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which statement is false about the OCI Vault service?', '["Older versions of master encryption keys can be used for decryption but cannot be used for encryption.", "Each new master encryption key is automatically assigned a key version with a unique Oracle Cloud Identifier (OCID).", "Master encryption keys are always stored in a Hardware Security Module (HSM).", "The vault''s public wrapping key is used only when you need to import an external key."]'::jsonb, '[2]'::jsonb, '', 'easy');
  SELECT id INTO s_id FROM subtopics WHERE name = 'Observability Services' AND course_id = (SELECT id FROM courses WHERE name = 'Oracle Cloud Infrastructure Architect Associate');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which service is integrated with OCI Monitoring and sends alarms to a Slack channel?', '["Notifications", "Events Service", "Vault", "DevOps Project"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'As a DevOps Engineer overseeing the deployment pipeline, you need deployment duration and deployment failure frequency for troubleshooting. Which OCI service would you use?', '["OCI DevOps Agent", "OCI Data Science service", "OCI Data Analysis service", "OCI Monitoring service"]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'An application is continuously logging sensitive information, which needs to be configured with restricted access to this log data. What is a possible solution?', '["Transition all sensitive logs into Object Storage using Service Connector.", "Configure Notifications Topic to alert when any sensitive data is logged into the Logging service.", "By default, OCI Logging identifies and restricts access to any sensitive logs.", "Choose a separate logs group for sensitive logs and use IAM policies."]'::jsonb, '[3]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'Which feature of the Events service is used to trigger an automated action when a specific event occurs in a DevOps Project?', '["Rules", "Functions", "Alarms", "Topic"]'::jsonb, '[0]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'mcq', 'You are tasked with troubleshooting failures seen with build runs through the DevOps Project. What information would you need to check first?', '["Unified Agent Logs", "Service Logs", "Custom Logs", "Service Connector Logs"]'::jsonb, '[1]'::jsonb, '', 'easy');
  INSERT INTO questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty)
  VALUES (s_id, 'msq', 'You are part of a team working on a DevOps project. There is a requirement to provision an Object Storage bucket whenever the Code Repository is updated. Which two could you use to achieve this? (Select TWO)', '["Service Connector", "Streaming", "Functions", "Events service"]'::jsonb, '[2, 3]'::jsonb, '', 'hard');
END $$;

-- Total Questions: 317
COMMIT;
