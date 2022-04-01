import {createAsyncThunk} from "@reduxjs/toolkit";
import {todolistAPI} from "../../../../Api/SeaApi";
import {
    seaAsyncHandleNetwork,
    seaHandleAsyncServer,
} from "../../../../SeaUtils/SeaErrorUtils";
import {changeTodolistStatus} from "./TodolistReducer";
import {getTasks} from "./TasksActions";
import {TodolistActions} from "../ActionsEnum/TodolistsActionsEnum";
import {appActions} from "../../../SeaApplication/applicationIndex";
import {ThunkErrorAPIConfigType} from "../../../../SeaUtils/UtilsTypes";
import {SeaTodolistsType} from "../TodolistTypes";

const {setSeaAppStatus} = appActions

export const getTodolists = createAsyncThunk<{ data: SeaTodolistsType[] }, undefined, ThunkErrorAPIConfigType>(TodolistActions.SET_FROM_SERVER, async (param, thunkAPI) => {
    const {
        dispatch
    } = thunkAPI

    dispatch(setSeaAppStatus({status: 'loading'}))
    try {
        let sea = await todolistAPI.getTodolists()
        return {data: sea}
    } catch (e: any) {
        return seaAsyncHandleNetwork(e, thunkAPI)
    } finally {
        dispatch(setSeaAppStatus({status: 'succesed'}))
    }
})
export const postTodolists = createAsyncThunk<{ item: { id: string; title: string; addedDate: string; order: number } },
    string, ThunkErrorAPIConfigType>
(TodolistActions.ADD_TODOLIST, async (title: string, thunkAPI) => {
    const {dispatch} = thunkAPI
    dispatch(setSeaAppStatus({status: 'loading'}))
    try {
        let sea = await todolistAPI.postTodolists(title)
        if (sea.resultCode === 0) {
            const {item} = sea.data;
            return {item: item}
        } else {
            return seaHandleAsyncServer(sea, thunkAPI, false)
        }
    } catch (e: any) {
        return seaAsyncHandleNetwork(e, thunkAPI)
    } finally {
        dispatch(setSeaAppStatus({status: 'succesed'}))
    }
})
export const removeTodolists = createAsyncThunk(TodolistActions.REMOVE_TODOLIST, async (param: { todolistID: string }, thunkAPI) => {
    const {
        dispatch,
        rejectWithValue
    } = thunkAPI

    dispatch(setSeaAppStatus({status: 'loading'}))
    dispatch(changeTodolistStatus({todolistId: param.todolistID, status: 'loading'}))
    try {
        await todolistAPI.deleteTodolists(param.todolistID)
        return {todolistId: param.todolistID}
    } catch (e: any) {
        seaAsyncHandleNetwork(e, thunkAPI)
        return rejectWithValue(null)
    } finally {
        dispatch(setSeaAppStatus({status: 'succesed'}))
    }
})
export const changeTodolists = createAsyncThunk(TodolistActions.CHANGE_TODOLIST, async (seaParam: { todolistID: string, title: string }, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(setSeaAppStatus({status: 'loading'}))
    dispatch(changeTodolistStatus({todolistId: seaParam.todolistID, status: 'loading'}))

    try {
        let sea = await todolistAPI.changeTodolists(seaParam.todolistID, seaParam.title)
        if (sea.data.resultCode === 0) {
            return {todolistId: seaParam.todolistID, newTitle: seaParam.title}
        } else {
            seaHandleAsyncServer(sea.data, thunkAPI, false)
            return rejectWithValue({errors: sea.data.messages, fieldsErrors: sea.data.fieldsErrors})
        }
    } catch (e: any) {
        return seaAsyncHandleNetwork(e, thunkAPI, false)
    } finally {
        dispatch(setSeaAppStatus({status: 'succesed'}))
    }
})

export const reorderTodolists = createAsyncThunk(TodolistActions.REORDER_TODOLIST, async (seaParam: { todolistID: string, putAfterItemId: string | null }, thunkAPI) => {
    const {
        dispatch,
        rejectWithValue
    } = thunkAPI

    dispatch(setSeaAppStatus({status: 'loading'}))
    dispatch(changeTodolistStatus({todolistId: seaParam.todolistID, status: 'loading'}))
    try {
        let sea = await todolistAPI.reorderTodolists(seaParam.todolistID, seaParam.putAfterItemId)
        if (sea.data.resultCode === 0) {
            dispatch(getTodolists())
            dispatch(getTasks(seaParam.todolistID))
        } else {
            seaHandleAsyncServer(sea.data, thunkAPI)
            return rejectWithValue(null)
        }
    } catch (e: any) {
        return seaAsyncHandleNetwork(e, thunkAPI)

    } finally {
        dispatch(setSeaAppStatus({status: 'succesed'}))
        dispatch(changeTodolistStatus({todolistId: seaParam.todolistID, status: 'succesed'}))
    }
})