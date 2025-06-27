import api from "@/utils/api";


export const getDashboardData = async () => {


    const response = await api.get('/dashboard');
    if(response.status !== 200) {
        throw new Error('Failed to fetch dashboard data');
    }

    return response.data.data;

};


export const getAgentDashboard = async () => {


    const response = await api.get('/dashboard/agent');
    if(response.status !== 200) {
        throw new Error('Failed to fetch dashboard data');
    }

    return response.data.data;

};