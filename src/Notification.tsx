import "./Notification.css"

function Notification({title, message, func}: {title: string, message: string, func: (arg0:boolean) => void}) {

    return (
        <div id={`notif-${title}`} className="notif-container" onAnimationEnd={() => {
            console.log("Animation Done")
            func(false);
        }}>
            <div className="notif-title">
                {title}
            </div>
            <div className="notif-message">
                {message}
            </div>
            <div className="notif-small-box"></div>
        </div>
    )
}

export default Notification;