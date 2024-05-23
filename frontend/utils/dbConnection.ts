import axios from "axios";

const API_URL = 'http://localhost:5000';


export function queryMaker(endpoint: string, method: string, data: JSON | null) {
    if (method === 'GET') {
        return axios.get(`${API_URL}/${endpoint}`);
    } else if (method === 'POST') {
        return axios.post(`${API_URL}/${endpoint}`, data);
    } else if (method === 'PUT') {
        return axios.put(`${API_URL}/${endpoint}`, data);
    } else if (method === 'DELETE') {
        return axios.delete(`${API_URL}/${endpoint}`);
    }
}