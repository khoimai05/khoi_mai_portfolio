import re

css_path = r'c:\Users\Alan\Desktop\portfolio\khoi_mai_portfolio\css\layout.css'
with open(css_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace #sql-terminal
old_terminal = '''#sql-terminal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(207, 185, 145, 0.25);
  border-top: 2px solid rgba(207, 185, 145, 0.5);
  border-radius: 12px;
  padding: 32px;
  font-family: Menlo, Consolas, 'Courier New', monospace;
  box-shadow: 0 0 40px rgba(207, 185, 145, 0.05), inset 0 1px 0 rgba(207, 185, 145, 0.08);
}'''

new_terminal = '''#sql-terminal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #050505;
  border: 1px solid #FFB000;
  border-radius: 4px;
  padding: 32px;
  font-family: Menlo, Consolas, 'Courier New', monospace;
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.3), inset 0 0 15px rgba(255, 176, 0, 0.2);
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 3px rgba(255, 176, 0, 0.6);
}

#sql-terminal::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  z-index: 2;
  background-size: 100% 4px, 6px 100%;
  pointer-events: none;
}'''

old_chip = '''.sql-chip {
  font-family: Menlo, Consolas, 'Courier New', monospace;
  font-size: 13px;
  color: rgba(207, 185, 145, 0.85);
  background: rgba(207, 185, 145, 0.08);
  border: 1px solid rgba(207, 185, 145, 0.3);
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.sql-chip:hover {
  background: rgba(207, 185, 145, 0.15);
  border-color: rgba(207, 185, 145, 0.55);
  color: #CFB991;
  box-shadow: 0 0 12px rgba(207, 185, 145, 0.2);
  transform: translateY(-1px);
}

.sql-chip-active {
  background: rgba(207, 185, 145, 0.2);
  border-color: #CFB991;
  color: #CFB991;
  box-shadow: 0 0 16px rgba(207, 185, 145, 0.25);
}'''

new_chip = '''.sql-chip {
  font-family: Menlo, Consolas, 'Courier New', monospace;
  font-size: 13px;
  color: rgba(255, 176, 0, 0.7);
  background: transparent;
  border: none;
  padding: 8px 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  letter-spacing: 0.3px;
}
.sql-chip::before { content: "[ "; }
.sql-chip::after { content: " ]"; }

.sql-chip:hover {
  color: #FFB000;
  text-shadow: 0 0 8px rgba(255, 176, 0, 0.8);
}

.sql-chip-active {
  background: rgba(255, 176, 0, 0.15);
  color: #FFB000;
  text-shadow: 0 0 5px rgba(255, 176, 0, 0.8);
}
.sql-chip-active::before { content: "> "; }
.sql-chip-active::after { content: ""; }'''

old_colors = '''.sql-echo {
  font-size: 13px;
  color: rgba(207, 185, 145, 0.5);
  margin-bottom: 10px;
}

.sql-result-table {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  white-space: pre;
  overflow-x: auto;
}

.sql-rowcount {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(207, 185, 145, 0.5);
}

.sql-error {
  font-size: 13px;
  color: rgba(255, 120, 120, 0.8);
}

.sql-empty {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.3);
}

.sql-empty::after {
  content: '_';
  display: inline-block;
  animation: blink-cursor 1.1s step-start infinite;
}'''

new_colors = '''.sql-echo {
  font-size: 13px;
  color: #FFB000;
  margin-bottom: 10px;
  opacity: 0.8;
}

.sql-result-table {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #FFB000;
  white-space: pre;
  overflow-x: auto;
  position: relative;
  z-index: 3;
}

.sql-rowcount {
  margin-top: 8px;
  font-size: 12px;
  color: #FFB000;
  opacity: 0.6;
}

.sql-error {
  font-size: 13px;
  color: #FF3333;
}

.sql-empty {
  font-size: 13px;
  color: #FFB000;
  opacity: 0.5;
}

.sql-empty::after {
  content: '█';
  display: inline-block;
  animation: blink-cursor 1.1s step-start infinite;
}'''

print(text.count(old_terminal), text.count(old_chip), text.count(old_colors))
text = text.replace(old_terminal, new_terminal)
text = text.replace(old_chip, new_chip)
text = text.replace(old_colors, new_colors)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('done')
