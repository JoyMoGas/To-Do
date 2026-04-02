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

export const getActivities = async (taskListId = null) => {
    let url = `${getBaseUrl()}activities/`;
    if (taskListId) {
        url += `?task_list=${taskListId}`;
    }
    const response = await axios.get(url, getHeaders());
    return response.data;
};

export const createActivity = async (title, description, taskListId = null, sectionId = null) => {
    const data = { title, description, completed: false };
    if (taskListId) {
        data.task_list = taskListId;
    }
    if (sectionId) {
        data.section = sectionId;
    }
    const response = await axios.post(`${getBaseUrl()}activities/`, data, getHeaders());
    return response.data;
};

export const updateActivity = async (id, data) => {
    const response = await axios.patch(`${getBaseUrl()}activities/${id}/`, data, getHeaders());
    return response.data;
};

export const deleteActivity = async (id) => {
    const response = await axios.delete(`${getBaseUrl()}activities/${id}/`, getHeaders());
    return response.data;
};
