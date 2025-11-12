import Sidebar from "./sidebar";
import Mainpage from "./contentpage";
import './wholepage.css'

import { useState } from "react";

export default function Wholepage(){

    const [docvisible,Setdocvisible] = useState(false);
    const [chat,Setchat] = useState("");

    return(
        <div className="wholepage">
            <Sidebar docvisible={docvisible} Setchat={Setchat} Setdocvisible={Setdocvisible} />
            <Mainpage Setchat={Setchat} chat={chat} docvisible={docvisible} />
        </div>
    )
}