import {FormEvent, useEffect, useState } from "react"

type taskType = {
  id:number,
  name:string,
  time:string,
  des:string,
  status:boolean
}

export default function App() {
  const [taskName,setTaskName] = useState<string>("")
  const [taskDes,setTaskDesc] = useState<string>("")
  const [taskTime,setTaskTime] = useState<string>("")
  const [tasks,setTasks] = useState<taskType[]>([])
  const [newTaskId, setNewTaskId] = useState<number | null>(null);

  useEffect(()=>{
    let savedTask = localStorage.getItem("tasks");
    console.log("got")
    if(savedTask)
    {
      setTasks(JSON.parse(savedTask))
    }
  },[])

  useEffect(()=>{
    if(newTaskId)
    notify(newTaskId)
  },[tasks])
  
  function handleSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    let id = Date.now();
    let newTask:taskType = {id:id,name:taskName,des:taskDes,time:taskTime,status:false};
    setNewTaskId(id);
    setTasks((prevTasks)=>[...prevTasks,newTask]);
    setTaskName("")
    setTaskDesc("")
  }

  function handleEdit(id:number){
    let newName = prompt("Enter the name");
    let newDesc = prompt("Enter the description");
    let updatedTasks = tasks.map((task)=>{
      if(task.id===id && newName && newDesc)
      {
        return {...task, name:newName, des:newDesc}
      }
      else{
        return task
      }
    })
    setTasks(updatedTasks)

  }

  function handleDelete(id:number)
  {
    let updatedTasks = tasks.filter((task)=>{
      if(task.id===id)
      {
        return false;
      }
      else{
        return true;
      }
    })
    setTasks(updatedTasks);
  }
  
  function handleStatus(id: number) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task
      )
    );
  }
  
  function notify(id:number){
    const now = new Date();
    const hr = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();
    let taskHr: string | number;
    let taskMin: string | number;
    console.log(tasks);
    
    tasks.forEach(task => {
      if(task.id===id)
      {
        [taskHr, taskMin] = task.time.split(":");
        taskHr = Number(taskHr) - hr;
        taskMin = Number(taskMin) - min;
        console.log(task.name);
        
        if(taskHr>=0 && taskMin>=0)
        {
          console.log(taskHr,taskMin,task.time,hr,min);
          let delay: number = (taskHr * 60 + taskMin) * 60 * 1000 - sec * 1000;
          console.log(task.name,delay)
          if (delay >= 0) {
            setTimeout(() => {
              alert(`To do: ${task.name}`);
            }, delay);
          }
        }
      }
    });
  }

  function handleSave()
  {
    localStorage.setItem("tasks",JSON.stringify(tasks))
    alert("saved!!!")
  }
  return (
    <div className="flex flex-col h-full justify-center items-center bg-amber-100">
      <div className="flex flex-col max-w-[60%]">
        <div className="flex justify-center items-center text-[60px] font-extrabold mb-7">
          AI TO-DO LIST MAKER PRO !
        </div>
        <div className="flex bg-gray-400 p-[20px] border-2 rounded-2xl justify-around items-center hover:shadow-2xl">
          <form action="" onSubmit={(e)=>handleSubmit(e)}>
          <input className="p-[5px] focus:border-0 focus:outline-0 placeholder:text-black-50 bg-amber-100 rounded-xl text-center shadow-2xs" type="text" placeholder="Enter the task name" onChange={(e)=>setTaskName(e.target.value)} value={taskName} required />
          <input className="p-[5px] focus:border-0 focus:outline-0 placeholder:text-black-50 bg-amber-100 rounded-xl text-center shadow-2xs" type="text" placeholder="Enter the task description" onChange={(e)=>setTaskDesc(e.target.value)} value={taskDes} required />
          <input className="p-[5px] focus:border-0 focus:outline-0 placeholder:text-black-50 bg-amber-100 rounded-xl text-center shadow-2xs" type="time" placeholder="time" name="taskTime" onChange={(e)=>setTaskTime(e.target.value)}value={taskTime} required />
          <button className="bg-blue-500 transition-all hover:bg-blue-400 hover:text-black px-2 py-1 rounded-[8px] text-white">Add Task</button>
          </form>
          <button className="bg-green-500 transition-all hover:bg-green-400 hover:text-black px-2 py-1 rounded-[8px] text-white" onClick={()=>handleSave()}>Save</button>
        </div>
        <div className="flex justify-center items-center flex-wrap gap-[30px] mt-[20px]">
          {tasks.map((task)=>{
            return(
            <div key={task.id} onClick={()=>handleStatus(task.id)} className="flex flex-col justify-around border-2 shadow-2xs hover:shadow-2xl hover:border-gray-600  rounded-[20px] items-center min-h-[150px] min-w-[150px] max-w-[250px] p-[10px] cursor-pointer" style={{background:(task.status)?"lightgreen":"orange"}}> 
              <div className="flex flex-col justify-center items-center text-center">
                <h3 className="flex font-bold">{task.name}</h3>
                {task.des}
              </div>
              <div className="flex w-full justify-around items-center">
                <button className="bg-cyan-600 shadow-2xl transition-all hover:bg-sky-400 hover:text-black px-2 py-1 rounded-[8px] text-white" onClick={()=>handleEdit(task.id)}>Edit</button>
                <button className="bg-red-500 transition-all hover:bg-red-400 hover:text-black px-2 py-1 rounded-[8px] text-white" onClick={()=>handleDelete(task.id)}>Delete</button>
              </div>
            </div>)
          })}
        </div>
      </div>
    </div>
  )
}
