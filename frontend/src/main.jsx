import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout.jsx';
import UploadPage from './Upload_page.jsx';
import Home from "./Home.jsx";
import LoadReport from './loadReport.jsx';
import './assets/tailwind.css';
import Report from './Report.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element ={<Home/>}/>
        <Route path="/upload" element={<UploadPage/>}/>
        <Route path= "/result" element = {<LoadReport/>}/>
        <Route path = "/report" element = {<Report/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
