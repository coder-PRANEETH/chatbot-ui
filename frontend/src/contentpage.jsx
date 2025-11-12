import './contentpage.css'
import Docu from './docu'
import Upbar from './upbar'
import Chat from './chatarea'


import { useEffect,useState } from 'react'

export default function Mainpage({Setchat,chat,docvisible}){
    const [newchat,Setnewchat] = useState(true);



    return(
        <div className="mainpage">
            <Upbar chat={chat}  Setnewchat={Setnewchat} />
            <div className="group">

           {!docvisible && <Docu />}
            <Chat Setchat={Setchat} docvisible={docvisible}  Setnewchat={Setnewchat} newchat={newchat} chat={chat}/>
            
            </div>
        </div>)
}