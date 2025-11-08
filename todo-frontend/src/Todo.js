import { useEffect, useState } from "react";
export default function Todo(){

    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const[todos,setTodos]=useState([]);
    const[error,setError]=useState("");
    const[message,setMessage]=useState("");
    const[editId,setEditId]=useState(-1);
    //const[deleteId,setdeleteId]=useState(-1);
    //Edit
    const[editTitle,setEditTitle]=useState("");
    const[editDescription,setEditDescription]=useState("");
    const apiUrl= `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`;

    const handleSubmit=()=>{
        setError("");
        //check inputs
        if(title.trim() != '' && description.trim()!=''){
            fetch(apiUrl+'/todos',{
                method:"POST",
                headers:{
                    'content-type':'application/json'
                },
                body:JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok){
                    //add item to list
                    setTodos([...todos,{title,description}]);
                    setDescription("");
                    setTitle("");
                    setMessage("Item added successfully");
                    setTimeout(()=>{
                        setMessage("");
                    },2000);
                    
                }else{
                    //set error
                    setError("Unable to create Todo item");
                }                
            }).catch(()=>{
                setError("Unable to create Todo item");
            })
            

        }
    }

    useEffect(()=>{
        getItems()
    },[])
    const getItems=()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>res.json())
        .then((res)=>{
            setTodos(res);
        })
    }
    const handleUpdate = () => {
    setError("");
    //check inputs
    if (editTitle.trim() != '' && editDescription.trim() != '') {
        fetch(`${apiUrl}/todos/${editId}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ title: editTitle, description: editDescription })
        }).then((res) => {
            if (res.ok) {
                //update item to list
                const updatedTodos = todos.map((item) => {
                    if (item._id == editId) {
                        item.title = editTitle;
                        item.description = editDescription;
                    }
                    return item;
                })
                setTodos(updatedTodos);
                setMessage("Item updated successfully");
                setTimeout(() => {
                    setMessage("");
                }, 2000);
                setEditId(-1);
            } else {
                //set error
                setError("Unable to update Todo item");
            }
        }).catch(() => {
            setError("Unable to update Todo item");
        })
    }
}

    const handleEdit=(item)=>{
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    }
    const handleEditCancel=()=>{
        setEditId(-1);

    }
    const handleDelete=(id)=>{
        if(window.confirm('Are you sure want to delete?')){
            fetch(apiUrl+'/todos/'+id,{
                method:"DELETE"
            })
            .then(()=>{
                const updatedTodos= todos.filter((item)=>item._id !== id);
                setTodos(updatedTodos);
            })
        }

    }
    return <>
    <div className="row p-3">
    <div className="row p-3 bg-success text-light" >
        <h1>TODO LIST - MERN Stack</h1>
    </div>
    <div className="row text-start">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
            <input placeholder="Title" onChange={(e)=>setTitle(e.target.value)} value={title} className="form-control" type="text"></input>
            <input placeholder="Description" onChange={(e)=>setDescription(e.target.value)} value={description} className="form-control" type="text"></input>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}     
    </div>
    <div className="row mt-3 text-start">
        <h3>Tasks</h3>
        <div className="col-md-6">
            <ul className="list-group">
            {
                todos.map((item)=> <li className="list-group-item bg-info d-flex justify-content-between align-items-centre my-2 ">
            <div className="d-flex flex-column me-2">
                {
                    editId==-1 || editId!= item._id ?
                    <>
                    <span className="fw-bold">{item.title}</span>
                    <span className="">{item.description}</span>
                    </>: 
                    <div className="form-group d-flex gap-2">
                    <input placeholder="Title" onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text"></input>
                    <input placeholder="Description" onChange={(e)=>setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text"></input>
                    </div>
                }
                
            </div>
            <div className="d-flex gap-2">
            {editId==-1 || editId!= item._id  ?<button className="gap-3 btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>:<button className="gap-3 btn btn-warning" onClick={handleUpdate}>Update</button>}
            {editId==-1?<button className="gap-3 btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>:
            <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
            </div>
        </li>)
            }
        
            </ul>
        </div>
    </div>
    </div>

    
    </>
    

}