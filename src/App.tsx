import { useState, useEffect, type JSX } from 'react'
import './App.css'
import Message from './Message'

function App() {
  const [file, setFile] = useState<File | null>()
  const [messages, setMessages] = useState<JSX.Element[]>([])
  const [name, setName] = useState<string>('')
  const [filter, setFilter] = useState<string>('')
  const [idList, setIdList] = useState<number[]>([])

  const reader = new FileReader()
  let lastSender = ""
  let numberOfMessages = 0
  let lastElementScrolledTo = -1;

  const [dates, setDates] = useState<Date[]>([])
  const [inpDate, setInpDate] = useState<Date>()

  reader.onload = function (e) {
    if (e.target?.result) {
      const lines = e.target.result.toString().split('\n')
      if (lines[lines.length - 1] === "")
        lines.pop()
      const datesList: Date[] = []
      setMessages(lines.map((e) => formatLine(e,datesList)))
      setDates(datesList)
      const nom = document.getElementById("nom")
      if (nom)
        nom.innerHTML = numberOfMessages + " messages"
      if (numberOfMessages === 0)
        document.title = "Chat Display"
      else
        document.title = numberOfMessages + " messages"
    }
  }

  useEffect(() => {
    if (file && name !== "")
      reader.readAsText(file)
    else if (file) {
      (document.getElementById("file") as HTMLInputElement).value = ""
      alert("Please select a name first then the file...")
    }
  }, [file])

  useEffect(() => {
    if (filter !== "") {
      const ids: number[] = []
      messages.map((message) => {
        if (message.props.message.includes(filter)) ids.push(message.key ? Number.parseInt(message.key) : -1)
      })
      setIdList(ids)
    }

  }, [filter])

  useEffect((
    () => {
      if(inpDate)
      {
        let year: number = -1, month: number = -1, day: number = -1;
        inpDate.setMonth(inpDate.getMonth()+1);
        dates.map((date, index) => {
          if(year===-1 && date.getFullYear() === inpDate.getFullYear())
            year = index;
        })
        dates.map((date, index) => {
          if(month===-1 && date.getFullYear() === inpDate.getFullYear() && date.getMonth() === inpDate.getMonth())
            month = index;
        })
        dates.map((date, index) => {
          if(day===-1 && date.getFullYear() === inpDate.getFullYear() && date.getMonth() === inpDate.getMonth() && date.getDate() === inpDate.getDate())
            day = index;
        })
        const id: number = day>=0 ? day : month>=0 ? month : year>=0 ? year : -1;
        if(id!==-1)
          document.getElementById(id.toString())?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  ), [inpDate])


  return (
    <>
      <div className='header'>
        <input type="text" name="name" id="name" placeholder="Name" required
          onChange={(e) => setName(e.target.value)} />
        <input type="file" name="file" id="file" accept=".txt" required
          onChange={(e) => { if (e.target.files) setFile(e.target.files[0]) }} />
        <hr />
        <p id="nom"></p>
        <input type="search" name="search" id="search" placeholder="Search" required
          onChange={(e) => setFilter(e.target.value)} />
        Found {idList.length}
        <div className="protrait-only"></div>
        <input type="date" name="date" id="date"  required
          onChange={(e) => 
          {
            setInpDate(new Date(e.target.value))
          }} />
        <input type="button" value="Previous" onClick={() => {
          if (lastElementScrolledTo > 0) document.getElementById(idList[--lastElementScrolledTo].toString())?.scrollIntoView({ behavior: "smooth", block: "start" })
        }} />
        <input type="button" value="Next" onClick={() => {
          if (idList.length - 1 > lastElementScrolledTo) document.getElementById(idList[++lastElementScrolledTo].toString())?.scrollIntoView({ behavior: "smooth", block: "start" })
        }} />
      </div>
      <div id="messages">
        {messages}
      </div>
    </>
  )

  function formatLine(line: string, datesList: Date[]) {
    //Date Format
    let tempDate: string = line.substring(0, line.indexOf(',')).trim();
    if (tempDate.length > 8 && !tempDate.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)) tempDate = ""
    else if (tempDate.length === 8 && tempDate.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{2}/)) tempDate = tempDate.substring(0, 6) + "20" + tempDate.substring(6);

    const date: Date = new Date(
      Number.parseInt(tempDate.substring(tempDate.lastIndexOf('/') + 1)),
      Number.parseInt(tempDate.substring(tempDate.indexOf('/') + 1, tempDate.indexOf('/', tempDate.indexOf('/') + 1))),
      Number.parseInt(tempDate.substring(0, tempDate.indexOf('/')))
    );

    datesList.push(date);

    //Time Format
    let time: string = line.substring(line.indexOf(',') + 1, line.indexOf('-')).trim();
    const time2: string = (time.match(/[0-9]{1,2}:[0-9]{2}/) ? time.substring(0, time.length - 3) : "")
    if (time2.length == 0) time = ""
    if (time.length - time2.length > 3) time = ""

    //Messange & Name Format
    let messangerName: string = '';
    let message: string = '';
    if (line.indexOf(':', line.indexOf('-')) == -1) {
      message = line.substring(line.indexOf('-') + 1).trim();
    }
    else {
      messangerName = line.substring(line.indexOf('-') + 1, line.indexOf(':', line.indexOf('-'))).trim();
      message = line.substring(line.indexOf(':', line.indexOf('-')) + 1).trim();
    }
    if (messangerName === "" || time === "" || tempDate === "")
      messangerName = lastSender

    //Display & Logic
    const element = <Message key={numberOfMessages} id={numberOfMessages.toString()} message={message} name={messangerName} date={date} time={time} username={name} lastSender={lastSender} />
    lastSender = messangerName
    numberOfMessages++
    return element
  }

}

export default App
