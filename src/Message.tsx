import "./Message.css"

function Message({id, message, name, date, time, username, lastSender} : {id: string, message: string, name: string, date: Date, time: string, username: string, lastSender: string}) {
  return (
    <div id={id} className={name === username ? "message message-name-self" : name === "" ? "message message-system" : "message"}>
        <div className="message-name">{lastSender===name ? "" : name}</div>
        <div className="message-message" style={{color: message === "This message was deleted" || message === "<Media omitted>" ? "rgb(70,70,70)" : ""}}>{message}</div>
        <div className="message-date">{Number.isNaN(date.getDay()) ? "" :`${date.getDay()}/${date.getDate()}/${date.getFullYear()}`}  {time}</div>
    </div>
  )
}

export default Message