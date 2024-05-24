import axios from "axios";

const API_URL = 'http://localhost:5000';


export function queryMaker(endpoint: string, method: string, data: JSON | null) {
    let response = null;

    if (method === 'GET') {
        response = axios.get(`${API_URL}/${endpoint}`);
    } else if (method === 'POST') {
        response =  axios.post(`${API_URL}/${endpoint}`, data);
    } else if (method === 'PUT') {
        response =  axios.put(`${API_URL}/${endpoint}`, data);
    } else if (method === 'DELETE') {
        response =  axios.delete(`${API_URL}/${endpoint}`);
    }

    return response;
}