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

export const getSections = async (taskListId) => {
    const response = await axios.get(`${getBaseUrl()}sections/?task_list=${taskListId}`, getHeaders());
    return response.data;
};

export const createSection = async (name, taskListId) => {
    const response = await axios.post(`${getBaseUrl()}sections/`, { name, task_list: taskListId }, getHeaders());
    return response.data;
};

export const deleteSection = async (id) => {
    const response = await axios.delete(`${getBaseUrl()}sections/${id}/`, getHeaders());
    return response.data;
};
