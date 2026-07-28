import re
import json

def escape_sql(text):
    if text is None:
        return ''
    return text.replace("'", "''")

def clean_html(text):
    # Remove simple HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()

def clean_apex_option(text):
    # Remove markers
    markers = [
        "(Correct Answer)", "(Correct – Your Answer)", "(Your Answer)",
        "(Correct - Your Answer)", "(Correct -  Your Answer)",
        "(Correct)", "(Incorrect)"
    ]
    for m in markers:
        text = text.replace(m, "")
    return text.strip()

def parse_apex_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove form feeds
    content = content.replace('\x0c', '')

    lines = [line.strip() for line in content.split('\n')]
    
    course_name = "Oracle APEX on Autonomous Database"
    questions = []
    
    current_subtopic = None
    i = 0
    
    # We look for something before "X Questions"
    while i < len(lines):
        line = lines[i]
        
        # Detect subtopic
        # Subtopics are usually followed by "X Questions\nTotal Questions"
        if i + 2 < len(lines) and "Questions" in lines[i+1] and "Total Questions" in lines[i+2]:
            current_subtopic = line
            i += 3
            continue
            
        # Detect Question
        # Question 1 · Getting Started with Oracle APEX on the Oracle Autonomous Database
        if line.startswith("Question ") and "·" in line:
            q_num_part = line.split("·")[0].strip()
            
            i += 1
            if i < len(lines) and ("Answered Correctly" in lines[i] or "Answered Incorrectly" in lines[i] or "Unanswered" in lines[i]):
                i += 1
                
            # Now we have the question text
            q_text_lines = []
            while i < len(lines) and not re.match(r'^[A-Z]\.', lines[i]):
                if lines[i]:
                    q_text_lines.append(lines[i])
                i += 1
                
            q_text = clean_html(" ".join(q_text_lines))
            
            # Now options
            options = []
            correct_answers = []
            
            while i < len(lines) and re.match(r'^[A-Z]\.', lines[i]):
                opt_lines = [lines[i]]
                i += 1
                while i < len(lines) and not re.match(r'^[A-Z]\.', lines[i]) and not lines[i].startswith("Explanation"):
                    if lines[i]:
                        opt_lines.append(lines[i])
                    i += 1
                
                opt_full = " ".join(opt_lines)
                # Remove "A. ", "B. ", etc.
                opt_full = re.sub(r'^[A-Z]\.\s*', '', opt_full)
                
                is_correct = False
                if "(Correct Answer)" in opt_full or "(Correct – Your Answer)" in opt_full or "(Correct - Your Answer)" in opt_full or "(Correct)" in opt_full:
                    is_correct = True
                    
                clean_opt = clean_html(clean_apex_option(opt_full))
                options.append(clean_opt)
                if is_correct:
                    correct_answers.append(len(options) - 1)
                    
            # Explanation
            explanation = ""
            if i < len(lines) and lines[i].startswith("Explanation"):
                i += 1
                exp_lines = []
                while i < len(lines) and not lines[i].startswith("Question ") and not (i + 2 < len(lines) and "Total Questions" in lines[i+2]):
                    if lines[i]:
                        exp_lines.append(lines[i])
                    i += 1
                explanation = clean_html(" ".join(exp_lines))
                # If explanation is just "Correct" or "Correct!", skip it or keep it
                if explanation.lower() in ["correct", "correct!", "incorrect"]:
                    explanation = ""
            else:
                pass
                
            q_type = 'mcq'
            q_lower = q_text.lower()
            if "which two" in q_lower or "which three" in q_lower or "choose the two" in q_lower or "choose the three" in q_lower or "select two" in q_lower or "select three" in q_lower:
                q_type = 'msq'
            
            # Determine difficulty
            difficulty = 'easy'
            if 'not' in q_text.lower().split() or 'medium' in q_text.lower():
                difficulty = 'medium'
            if q_type == 'msq':
                difficulty = 'medium'
            if len(q_text) > 200:
                difficulty = 'hard'
                
            questions.append({
                'course': course_name,
                'subtopic': current_subtopic,
                'type': q_type,
                'text': q_text,
                'options': options,
                'correct_answers': correct_answers,
                'explanation': explanation,
                'difficulty': difficulty
            })
            continue
            
        i += 1
        
    return questions

def parse_paas_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('\x0c', '')
    
    # Simple state machine
    lines = [line.strip() for line in content.split('\n')]
    
    questions = []
    
    current_course = None
    current_subtopic = None
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        if not line:
            i += 1
            continue
            
        # Check if course header
        if line == "Oracle Cloud Infrastructure Foundations" or line == "Oracle Cloud Infrastructure Architect Associate":
            current_course = line
            i += 1
            continue
            
        if line.startswith("Skill Check:"):
            current_subtopic = line.replace("Skill Check:", "").strip()
            i += 1
            continue
            
        if re.match(r'^Q\d+\.', line):
            # Question start
            q_text_lines = [line.split('.', 1)[1].strip()]
            i += 1
            
            while i < len(lines) and not lines[i].startswith('•') and not lines[i].startswith('ANSWER:'):
                if lines[i]:
                    q_text_lines.append(lines[i])
                i += 1
                
            q_text = " ".join(q_text_lines)
            
            # Options
            options = []
            while i < len(lines) and lines[i].startswith('•'):
                opt_lines = []
                opt_lines.append(lines[i][1:].strip())
                i += 1
                while i < len(lines) and not lines[i].startswith('•') and not lines[i].startswith('ANSWER:'):
                    if lines[i]:
                        opt_lines.append(lines[i])
                    i += 1
                opt_str = " ".join(opt_lines).strip()
                if opt_str:
                    options.append(opt_str)
                    
            # Answer
            ans_lines = []
            if i < len(lines) and lines[i].startswith('ANSWER:'):
                ans_lines.append(lines[i].replace('ANSWER:', '').strip())
                i += 1
                while i < len(lines) and not re.match(r'^Q\d+\.', lines[i]) and not lines[i].startswith("Skill Check:") and not lines[i] in ["Oracle Cloud Infrastructure Foundations", "Oracle Cloud Infrastructure Architect Associate"]:
                    if lines[i]:
                        ans_lines.append(lines[i])
                    i += 1
                    
            ans_str = " ".join(ans_lines).strip()
            
            # Match answers to options
            correct_answers = []
            
            q_type = 'mcq'
            q_lower = q_text.lower()
            if "select two" in q_lower or "select three" in q_lower or "choose two" in q_lower or "choose three" in q_lower or "all that apply" in q_lower:
                q_type = 'msq'
            
            # Use difflib to find the best match for the answer string among options
            import difflib
            
            def normalize(t):
                return re.sub(r'[^a-z0-9]', '', str(t).lower())
            
            ans_norm = normalize(ans_str)
            
            # If multiple answers are expected (msq), ans_str might contain multiple options combined.
            # But let's first check if it's a direct match or contains options.
            if q_type == 'msq':
                for idx, opt in enumerate(options):
                    opt_norm = normalize(opt)
                    if len(opt_norm) > 5 and (opt_norm in ans_norm or ans_norm in opt_norm):
                        correct_answers.append(idx)
            
            if not correct_answers:
                # Find the option with highest similarity to ans_norm
                best_match_idx = -1
                highest_ratio = 0
                for idx, opt in enumerate(options):
                    opt_norm = normalize(opt)
                    # Check substring first
                    if len(opt_norm) > 5 and (opt_norm in ans_norm or ans_norm in opt_norm):
                        best_match_idx = idx
                        break
                        
                    ratio = difflib.SequenceMatcher(None, opt_norm, ans_norm).ratio()
                    if ratio > highest_ratio:
                        highest_ratio = ratio
                        best_match_idx = idx
                        
                if best_match_idx != -1 and (highest_ratio > 0.4 or q_type != 'msq'):
                    correct_answers.append(best_match_idx)
                
            difficulty = 'easy'
            if 'not' in q_text.lower().split():
                difficulty = 'medium'
            if q_type == 'msq':
                difficulty = 'medium'
            if len(q_text) > 200:
                difficulty = 'hard'
                
            questions.append({
                'course': current_course or "Oracle Cloud Infrastructure",
                'subtopic': current_subtopic or "General",
                'type': q_type,
                'text': q_text,
                'options': options,
                'correct_answers': correct_answers,
                'explanation': '',
                'difficulty': difficulty
            })
            continue
            
        i += 1
        
    return questions

def generate_sql(apex_qs, paas_qs, output_file):
    all_qs = apex_qs + paas_qs
    
    courses = list(set([q['course'] for q in all_qs]))
    subtopics = list(set([(q['course'], q['subtopic']) for q in all_qs]))
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Migration Script for Oracle Certification MCQs\n")
        f.write("-- Generated automatically\n\n")
        
        f.write("BEGIN;\n\n")
        
        f.write("-- Clear existing data\n")
        f.write("DELETE FROM questions;\n")
        f.write("DELETE FROM subtopics;\n")
        f.write("DELETE FROM courses;\n\n")
        
        f.write("-- Insert Courses\n")
        for c in courses:
            f.write(f"INSERT INTO courses (id, title, description) VALUES (gen_random_uuid(), '{escape_sql(c)}', '{escape_sql(c)}');\n")
            
        f.write("\n-- Insert Subtopics\n")
        for c, s in subtopics:
            f.write(f"DO $$\nDECLARE\n  c_id UUID;\nBEGIN\n")
            f.write(f"  SELECT id INTO c_id FROM courses WHERE title = '{escape_sql(c)}';\n")
            f.write(f"  INSERT INTO subtopics (id, course_id, title) VALUES (gen_random_uuid(), c_id, '{escape_sql(s)}');\n")
            f.write(f"END $$;\n")
            
        f.write("\n-- Insert Questions\n")
        f.write("DO $$\nDECLARE\n  s_id UUID;\nBEGIN\n")
        
        # Sort questions by subtopic to minimize SELECTs
        # actually, just do a select per question or block
        
        current_subtopic = None
        for q in all_qs:
            if q['subtopic'] != current_subtopic:
                current_subtopic = q['subtopic']
                f.write(f"  SELECT id INTO s_id FROM subtopics WHERE title = '{escape_sql(current_subtopic)}' AND course_id = (SELECT id FROM courses WHERE title = '{escape_sql(q['course'])}');\n")
                
            opts_json = json.dumps(q['options']).replace("'", "''")
            ans_json = json.dumps(q['correct_answers'])
            
            f.write(f"  INSERT INTO questions (subtopic_id, question_type, content, options, correct_answers, explanation, difficulty)\n")
            f.write(f"  VALUES (s_id, '{q['type']}', '{escape_sql(q['text'])}', '{opts_json}'::jsonb, '{ans_json}'::jsonb, '{escape_sql(q['explanation'])}', '{q['difficulty']}');\n")
            
        f.write("END $$;\n\n")
        
        f.write(f"-- Total Questions: {len(all_qs)}\n")
        f.write("COMMIT;\n")

if __name__ == "__main__":
    apex = parse_apex_file("/Users/veera/batch-quiz-hub/mine/oci_apex_mcq.txt")
    paas = parse_paas_file("/Users/veera/batch-quiz-hub/mine/oracle_paas_mcq.txt")
    
    print(f"Parsed {len(apex)} APEX questions.")
    print(f"Parsed {len(paas)} PaaS questions.")
    
    # Find paas questions with 0 correct answers
    missing = [q for q in paas if len(q['correct_answers']) == 0]
    print(f"PaaS missing correct answers: {len(missing)}")
    for q in missing[:3]:
        print(f"Q: {q['text']}")
        print(f"Options: {q['options']}")
        
    generate_sql(apex, paas, "/Users/veera/batch-quiz-hub/supabase/migrations/20260728_seed_oracle_fusion.sql")
