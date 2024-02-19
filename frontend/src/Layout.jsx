import React from "react"
import Navbar from "./components/nav.jsx"
import Footer from "./components/footer.jsx"
import { Outlet } from "react-router-dom"
export default function Layout() {
  return (
      <div>
        <Navbar/>
        <Footer/>
        <Outlet/>
      </div>
  )
}

