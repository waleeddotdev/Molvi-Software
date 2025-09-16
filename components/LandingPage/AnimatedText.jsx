"use client"

import { motion } from "framer-motion"

const AnimatedText = ({ main, accent }) => {
    return (
        <motion.div className="flex items-center">
            <h1 className='font-recoleta flex flex-row gap-1 items-center justify-center text-pretty text-2xl font-extrabold leading-[105%]'>{main} <span className='font-guthenBloots ml-1 text-3xl transition-colors duration-700 hover:text-foreground text-pretty font-thin text-primary'>{accent}</span></h1>
        </motion.div>
    )
}
export default AnimatedText
