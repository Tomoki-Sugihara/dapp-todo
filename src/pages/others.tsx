import type { VFC } from 'react'
import { Layout } from 'src/components/layout'
import type { Task } from 'src/hooks/useTasks'
import { useTasks } from 'src/hooks/useTasks'
import styled from 'styled-components'

const Home: VFC = () => {
  const { myTasks } = useTasks()

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <TodoList>
          {myTasks &&
            myTasks.map((task: Task) => (
              // <li key={task[0]} className="grid grid-flow-row">
              <li key={task.id}>
                <input type="checkbox" checked={task.isCompleted} readOnly />
                <p>{task.content}</p>
                <div />
              </li>
            ))}
        </TodoList>
      </div>
    </Layout>
  )
}

const TodoList = styled.ol`
  display: flex;
  flex-direction: column;
  margin: 20px;

  > li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 500px;

    > input {
      width: 20px;
      height: 20px;
    }

    > p {
      font-size: 20px;
      font-weight: 700;
    }
  }
`

export default Home
