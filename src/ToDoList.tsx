import {useContext, useEffect, useState} from "react";
import {StateContext} from "./StateManager";

export function TodoList() {
    const [newTodo, setNewTodo] = useState("");
    const [todos, setTodos] = useState<Array<{ text: string; checked: boolean }>>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showCheckedItems, setShowCheckedItems] = useState(false);
    const stateManager = useContext(StateContext);

    const addTodo = () => {
        if (!newTodo) {
            return;
        }
        const newTodos = [...todos, {text: newTodo, checked: false}];
        stateManager.set("todos", newTodos);
        setTodos(newTodos);
        setNewTodo("");
    };

    const removeTodo = (index: number) => {
        const newTodos = todos.filter((_: any, i: number) => i !== index);
        stateManager.set("todos", newTodos);
        setTodos(newTodos);
        setEditIndex(null);
    };

    const handleTodoChange = (index: number, checked: boolean) => {
        const newTodos = [...todos];
        newTodos[index].checked = checked;
        stateManager.set("todos", newTodos);
        setTodos(newTodos);
    };

    const handleTodoEdit = (index: number) => {
        setEditIndex(index);
    };

    const handleTodoSave = (index: number, text: string) => {
        const newTodos = [...todos];
        newTodos[index].text = text;
        stateManager.set("todos", newTodos);
        setTodos(newTodos);
        setEditIndex(null);
    };

    useEffect(() => {
        setTodos(stateManager.get("todos") || []);
        return stateManager.subscribe("todos", () => {
            setTodos(stateManager.get("todos") || []);
            setEditIndex(null);
        });
    }, [stateManager]);

    const filteredTodos = showCheckedItems ? todos.filter(todo => todo.checked) : todos;
    return (
        <div className="todo-list-container">
            <div className='input-container'>
                <input
                    type="text"
                    value={newTodo}
                    placeholder='What do you need to do?'
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e)=>{
                        if (e.key==='Enter'){
                            e.preventDefault()
                            addTodo()
                        }
                    }}
                />
                <button className='add-button' onClick={addTodo}>Add</button>
            </div>
            <div className='list'>
                <div className='filter-buttons'>
                    <button
                        className={!showCheckedItems ? 'chosen' : ''}
                        onClick={() => setShowCheckedItems(false)}>All</button>
                    <button
                        className={showCheckedItems ? 'chosen' : ''}
                        onClick={() => setShowCheckedItems(true)}>Completed</button>
                </div>
                {filteredTodos.map((todo: { text: string; checked: boolean }, index: number) => (
                    <p key={index}>
                        {editIndex === index ? (
                            <input
                                type="text"
                                defaultValue={todo.text}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        handleTodoSave(index, e.currentTarget.value);
                                    }
                                }}
                                onBlur={(e) => {
                                    handleTodoSave(index, e.currentTarget.value);
                                }}
                            />
                        ) : (
                            <div className='item'>
                                <div className='left'>
                                    <input
                                        type="checkbox"
                                        checked={todo.checked}
                                        onChange={(e) => handleTodoChange(index, e.target.checked)}
                                    />
                                    <div className='text-box'>
                                        <span onClick={() => handleTodoEdit(index)}>{todo.text}</span>
                                    </div>
                                </div>
                                <div className='right'>
                                    <div onClick={() => handleTodoEdit(index)} className={'icon'}><img src='edit.png' alt={'edit'}/></div>
                                    <div onClick={() => removeTodo(index)} className={'icon'}><img src='trash.png' alt={'remove'}/></div>
                                </div>
                            </div>
                        )}
                    </p>
                ))}
            </div>
        </div>);
}

