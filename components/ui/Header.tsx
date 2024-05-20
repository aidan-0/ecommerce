import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header>
        <nav>
            <div className="menu-btn">
                <p>Menu</p>
            </div>
            <div className="logo">
                <Link href="#">
                    E-Commerce Site
                </Link>
            </div>
            <div className="local-time">
                <p>Local Time: 12:00 PM</p>
            </div>
        </nav>
    </header>
  )
}

export default Header