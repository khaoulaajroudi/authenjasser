import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios"


export const getpost=createAsyncThunk('post/get',async()=>{
    try{
let result=axios.get('http://localhost:5000/post/all')
return result
    }catch(error){
    console.log(error)
    }
})

export const addpost=createAsyncThunk('post/add',async(user)=>{
    try{
let result=axios.post('http://localhost:5000/post/add',user)
return result
    }catch(error){
    console.log(error)
    }
})
export const deletepost=createAsyncThunk('post/delete',async(id)=>{
    try{
let result=axios.delete(`http://localhost:5000/post/${id}`)
return result
    }catch(error){
    console.log(error)
    }
})

export const updatepost=createAsyncThunk('post/update',async({id, user})=>{
    try{
let result=axios.put(`http://localhost:5000/post/${id}`,user)
return result
    }catch(error){
    console.log(error)
    }
})


const initialState = {
 post:null,
 status:null
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers:{
    [getpost.pending]:(state)=>{
        state.status="pending";
    },
    [getpost.fulfilled]:(state,action)=>{
        state.status="success";
        state.post=action.payload.data?.list
    },
    [getpost.rejected]:(state,action)=>{
        state.status="failed";
    },
    [addpost.pending]:(state)=>{
        state.status="pending";
    },
    [addpost.fulfilled]:(state,action)=>{
        state.status="success";
    },
    [addpost.rejected]:(state,action)=>{
        state.status="failed";
    },
    [deletepost.pending]:(state)=>{
        state.status="pending";
    },
    [deletepost.fulfilled]:(state,action)=>{
        state.status="success";
    },
    [deletepost.rejected]:(state,action)=>{
        state.status="failed";
    },
    [updatepost.pending]:(state)=>{
        state.status="pending";
    },
    [updatepost.fulfilled]:(state,action)=>{
        state.status="success";
        state.post=action.payload.data?.post
    },
    [updatepost.rejected]:(state,action)=>{
        state.status="failed";
    }

  }
})
// Action creators are generated for each case reducer function
export const {} = postSlice.actions

export default postSlice.reducer