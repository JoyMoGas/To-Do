import axios from "axios";

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/activities/";
    return url.replace('activities/', '');
};

const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const getTaskLists = async () => {
    const response = await axios.get(`${getBaseUrl()}task-lists/`, getHeaders());
    return response.data;
};

export const createTaskList = async (name) => {
    const response = await axios.post(`${getBaseUrl()}task-lists/`, { name }, getHeaders());
    return response.data;
};

export const updateTaskList = async (id, data) => {
    const response = await axios.patch(`${getBaseUrl()}task-lists/${id}/`, data, getHeaders());
    return response.data;
};

export const deleteTaskList = async (id) => {
    const response = await axios.delete(`${getBaseUrl()}task-lists/${id}/`, getHeaders());
    return response.data;
};
