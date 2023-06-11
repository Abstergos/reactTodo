import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Context, server } from '../main';
import { toast } from 'react-hot-toast';
import Todoitem from '../components/Todoitem';
import { Navigate } from 'react-router-dom';

const Home = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);

const {isAuthenticated} = useContext(Context);

  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(`${server}/task/${id}`, {}, {
        withCredentials: true,
      });

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/task/${id}`, {
        withCredentials: true,
      });

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${server}/task/new`, { title, description }, {
        withCredentials: true,
        headers: { "content-type": "application/json" }
      });
      toast.success(data.message);
      setTitle("");
      setDescription("");
      setLoading(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false)
    }
  };
  useEffect(() => {
    axios.get(`${server}/task/my`, { withCredentials: true })
      .then((res) => { setTasks(res.data.tasks); })
      .catch((e) => {
        toast.error(e.response.data.message);
      })


  }, [refresh])

if(!isAuthenticated) return <Navigate to={"/login"}/>

  return (
    <div className='container'>
      <div className='login'>
        <section>
          <form onSubmit={submitHandler}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Title' required />
            <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder='Description' required />
            <button type='submit' disabled={loading}>Add Task</button>
          </form>
        </section>
      </div>

      <section className='todosContainer'>
        {
          tasks.map((i) => (
            <Todoitem title={i.title}
              description={i.description}
              isCompleted={i.isCompleted}
              updateHandler={updateHandler}
              deleteHandler={deleteHandler}
              id={i._id}
              key={i._id} />
          ))
        }
      </section>
    </div>
  )
}

export default Home;
