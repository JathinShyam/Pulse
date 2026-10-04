import re

with open(".stitch/designs/screen_3.html", "r") as f:
    html = f.read()

match = re.search(r'tailwind\.config\s*=\s*(\{.*?\});', html, re.DOTALL)
if match:
    print(match.group(1))
else:
    print("No tailwind config found")
