import re

with open("frontend/src/components/stitch/Screen0.tsx", "r") as f:
    content = f.read()

if '"use client";' not in content:
    content = '"use client";\n' + content

if 'from "framer-motion"' not in content:
    content = content.replace('import React from "react";', 'import React from "react";\nimport { motion } from "framer-motion";\nimport { useRouter } from "next/navigation";')

# We can replace <header className="fixed top-0 w-full z-50... 
# with <motion.header initial={{y: -100}} animate={{y: 0}} ...
content = content.replace('<header className="fixed top-0', '<motion.header initial={{y: -100}} animate={{y: 0}} className="fixed top-0')
content = content.replace('</header>', '</motion.header>')

# There is a main hero section usually. Let's look for <main
content = content.replace('<main ', '<motion.main initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2, duration: 0.8}} ')
content = content.replace('</main>', '</motion.main>')

# Add routing to the Sign In button
content = content.replace('href="#"', '')
content = content.replace('data-path="signin"', 'onClick={() => router.push("/login")} style={{cursor: "pointer"}}')
content = content.replace('data-path="features"', 'onClick={() => router.push("/composer")} style={{cursor: "pointer"}}')

# Inject router
if "const router = useRouter();" not in content:
    content = content.replace("export default function Screen0() {", "export default function Screen0() {\n  const router = useRouter();")

with open("frontend/src/components/stitch/Screen0.tsx", "w") as f:
    f.write(content)

