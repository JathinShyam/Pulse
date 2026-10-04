import re

with open("frontend/src/components/stitch/Screen3.tsx", "r") as f:
    content = f.read()

if 'from "framer-motion"' not in content:
    content = content.replace(
        'import React from "react";',
        'import React from "react";\nimport { motion } from "framer-motion";',
    )

# Animate aside
content = content.replace(
    "<aside",
    '<motion.aside initial={{x: -300}} animate={{x: 0}} transition={{type: "spring", stiffness: 100}}',
)
content = content.replace("</aside>", "</motion.aside>")

# Animate main content
content = content.replace(
    '<main className="w-full pt-16',
    '<motion.main initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.3}} className="w-full pt-16',
)
content = content.replace("</main>", "</motion.main>")

# Stagger the metric cards
cards_start = (
    '<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">'
)
cards_end = "<!-- End Metric Cards -->"  # Doesn't exist, we just animate the section
content = content.replace(
    cards_start,
    '<motion.section initial="hidden" animate="visible" variants={{hidden: {opacity: 0}, visible: {opacity: 1, transition: {staggerChildren: 0.1}}}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">',
)
content = content.replace("</section>", "</motion.section>")

# Individual card animation (we find the specific metric cards and change to motion.div)
content = re.sub(
    r'(<div className="relative p-space-lg rounded-DEFAULT bg-surface-card-dark shadow-md flex flex-col justify-between overflow-hidden group hover:bg-surface-card-hover transition-colors">)',
    r'<motion.div variants={{hidden: {y: 20, opacity: 0}, visible: {y: 0, opacity: 1}}} className="relative p-space-lg rounded-DEFAULT bg-surface-card-dark shadow-md flex flex-col justify-between overflow-hidden group hover:bg-surface-card-hover transition-colors">',
    content,
)

# Fix the closing tags for those div -> motion.div
# This is tricky with regex, we can just let framer-motion wrap the sections.
# It's better to just animate the headers and sections.
content = content.replace("</motion.div>", "</div>")  # revert in case of mess up
content = re.sub(
    r"<motion\.div variants=\{\{hidden: \{y: 20, opacity: 0\}, visible: \{y: 0, opacity: 1\}\}\}",
    r"<motion.div variants={{hidden: {y: 20, opacity: 0}, visible: {y: 0, opacity: 1}}}",
    content,
)

with open("frontend/src/components/stitch/Screen3.tsx", "w") as f:
    f.write(content)
