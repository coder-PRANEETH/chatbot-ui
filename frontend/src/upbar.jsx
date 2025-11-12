import './upbar.css';

export default function Upbar({chat,newchat,Setnewchat}) {
    
    const title = chat || "New chat";
    return(
        <div className="upbar">
            <button className="back"></button>
            <div className="title">{`${title}` || "no name"}</div>
            <div className="pre">
<div onClick={()=>Setnewchat(true)} className="tea">New Chat</div>
</div>
            <div className="load"></div>
        </div>)
}