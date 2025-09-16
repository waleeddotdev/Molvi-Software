"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const Header = () => {

    const clipPath = [
        "polygon(0px 40px, 20px 15px, calc(100% - 110px) 0px, calc(100% - 50px) 15px, 100% calc(100% - 90px), calc(100% - 50px) calc(100% - 70px), 120px calc(100% - 50px), 40px 100%, 40px calc(100% - 55px), 40px calc(100% - 125px))",
        "polygon(5px 50px, 30px 5px, calc(100% - 110px) 5px, calc(100% - 60px) 15px, 100% calc(100% - 110px), calc(100% - 60px) calc(100% - 70px), 110px calc(100% - 35px), 30px 100%, 50px calc(100% - 40px), 35px calc(100% - 135px))",
        "polygon(2.5px 45px, 25px 10px, calc(100% - 110px) 2.5px, calc(100% - 55px) 15px, 100% calc(100% - 105px), calc(100% - 55px) calc(100% - 70px), 115px calc(100% - 42.5px), 35px 100%, 45px calc(100% - 47.5px), 22.5px calc(100% - 130px))",
        "polygon(5px 35px, 15px 7.5px, calc(100% - 110px) 5px, calc(100% - 45px) 15px, 100% calc(100% - 95px), calc(100% - 45px) calc(100% - 70px), 125px calc(100% - 50px), 45px 100%, 35px calc(100% - 47.5px), 35px calc(100% - 120px))"
    ]

    const [currentClip, setCurrentClip] = useState(clipPath[0])

    useEffect(() => {
        let currentIndex = 0
        const interval = setInterval(() => {
            setCurrentClip(clipPath[currentIndex])
            currentIndex = (currentIndex + 1) % clipPath.length
        }, 250);
        return () => clearInterval(interval);
    }, [])

    return (
        <>
            <div className='w-full grid grid-row-2 lg:grid-cols-2 gap-10 lg:gap-5 py-10 lg:py-0 h-full'>
                <div className='space-y-8 px-4 md:px-0'>
                    <h1 style={{
                        textShadow: '1px 0px 0px, -1px 0px 0px, 0px 1px 0px, 0px -1px 0px var(--foreground)'
                    }} className='font-recoleta text-pretty text-6xl md:text-[5.5rem] font-extrabold leading-[105%]'>Welcome to Governance <span style={{
                        textShadow: 'none'
                    }} className='font-guthenBloots font-thin'>AI Agent</span></h1>
                    <p className=' md:text-xl max-w-[400px] text-pretty'>A Twitter AI Agent that gives automatic tweets on new proposal added or status changes in the governance.</p>
                    <Link href={'/auth/login'}>
                        <Button size={"lg"}>Login</Button>
                    </Link>
                </div>
                <div style={{ clipPath: currentClip, backgroundImage: `url("https://epe.brightspotcdn.com/e4/9d/1b3255914120af32ea07f7f110d4/ai-schoolwork-1461045156-b.jpg")` }} className='w-full h-[300px] lg:h-full bg-cover bg-center opacity-90'>

                </div>
            </div>
        </>
    )
}

export default Header