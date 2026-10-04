import re

with open("frontend/src/components/stitch/Screen1.tsx", "r") as f:
    content = f.read()

if 'from "framer-motion"' not in content:
    content = content.replace('import React, { useState } from "react";', 'import React, { useState } from "react";\nimport { motion } from "framer-motion";')

# Wrap the form section in a motion.div
form_start = '<form onSubmit={handleSend} className="flex flex-col gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">'
new_form_start = '<motion.form initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.4}} onSubmit={handleSend} className="flex flex-col gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">'

content = content.replace(form_start, new_form_start)
content = content.replace('</form>', '</motion.form>')

with open("frontend/src/components/stitch/Screen1.tsx", "w") as f:
    f.write(content)
