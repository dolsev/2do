//App.tsx
import { StateManager, StateContext } from "./StateManager";
import {TodoList} from "./ToDoList";
import Header from "./Header";
import './App.css'

export function App() {
    const stateManager = new StateManager();
    return (
        <StateContext.Provider value={stateManager}>
            <div className='App'>
                <Header/>
                <TodoList />
            </div>
        </StateContext.Provider>
    );
}
