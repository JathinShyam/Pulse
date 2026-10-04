with open("frontend/src/components/stitch/Screen2.tsx", "r") as f:
    content = f.read()

if 'from "framer-motion"' not in content:
    content = content.replace(
        'import React, { useState } from "react";',
        'import React, { useState } from "react";\nimport { motion } from "framer-motion";',
    )

# We can wrap the <main> tag body in <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.5}}>
main_open = '<main className="w-full min-h-screen pt-20 flex flex-col justify-center relative z-10 overflow-hidden">'
if main_open in content:
    content = content.replace(
        main_open,
        main_open
        + '\n<motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.5}} className="w-full flex justify-center">',
    )
    content = content.replace("</main>", "</motion.div>\n</main>")

with open("frontend/src/components/stitch/Screen2.tsx", "w") as f:
    f.write(content)
