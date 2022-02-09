import {
    addTaskAC,
    changeTaskAC,
    removeTaskAC,
    setTasksFromServAC,
    tasksActions
} from "./TasksActions";
import {addTodolistAC, removeTodolistAC, TodolistActions} from "./TodolistsActions";
import {initialTasks} from "./initailsStates";
import {ItemType} from "../Api/SeaApi";

export const taskReducer = (state: TasksStateType = initialTasks, action: seaTasksActionsType): TasksStateType => {
    switch (action.type) {
        case TodolistActions.ADD_TODOLIST: {
            return {[action.item.id]: [], ...state}
        }
        case TodolistActions.REMOVE_TODOLIST: {
            let taskCopy = {...state}
            delete taskCopy[action.todolistId]
            return taskCopy
        }
        case tasksActions.ADD_TASK: {
            return {
                ...state,
                [action.todolistID]: [action.item, ...state[action.todolistID]]
            }
        }
        case tasksActions.REMOVE_TASK: {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(f => f.id !== action.id)
            }
        }
        case tasksActions.SET_TASKS_FROM_SERVER: {
            return {
                ...state, [action.todolistID]: action.data
            }
        }
        case tasksActions.CHANGE_TASK: {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].map(m => m.id === action.taskID ? {...action.item} : m)
            }
        }
        default:
            return state
    }
}
export type seaTasksActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof setTasksFromServAC>
    | ReturnType<typeof changeTaskAC>
    | ReturnType<typeof removeTaskAC>

export type TasksStateType = { [key: string]: Array<ItemType> }
