import type { ChangeEvent, FormEvent, VFC } from 'react'
import { useState } from 'react'
import { Layout } from 'src/components/layout'
import type { Task } from 'src/hooks/useTasks'
import { useTasks } from 'src/hooks/useTasks'

import { useWeb3 } from '../hooks/useWeb3'

const Home: VFC = () => {
  const [input, setInput] = useState('')
  const { contract, account } = useWeb3()
  const { tasks, fetchTasks } = useTasks()

  const handleChangeCheckbox = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const targetTaskId = tasks[index][0]
    await contract?.methods.toggleCompleted(targetTaskId).send({ from: account })
    await fetchTasks()
  }

  const handleClick = async (index: number) => {
    const targetTaskId = tasks[index][0]
    await contract?.methods.deleteTask(targetTaskId).send({ from: account })
    await fetchTasks()
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!input.trim()) {
      alert('空文字のタスクは登録できません')
      return
    }

    await contract?.methods.createTask(input).send({ from: account })
    await fetchTasks()

    setInput('')
  }

  return (
    <Layout>
      <ol>
        {tasks &&
          tasks.map((task: Task, index: number) => (
            // <li key={task[0]} className="grid grid-flow-row">
            <li key={task[0]} className="flex flex-row">
              <input type="checkbox" checked={task[2]} onChange={(e) => handleChangeCheckbox(e, index)} />
              <div>{task[0]}</div>
              <div>{task[1]}</div>
              <button onClick={() => handleClick(index)}>削除</button>
            </li>
            // <div key={task.id}>
            //   <div>{task.id}</div>
            //   <div>{task.content}</div>
            //   <div>{task.completed}</div>
            // </div>
          ))}
      </ol>
      <form onSubmit={handleSubmit} className="m-6">
        <input value={input} onChange={handleChange} />
        <button type="submit" className="ml-2">
          登録
        </button>
      </form>
    </Layout>
  )
}

export default Home
