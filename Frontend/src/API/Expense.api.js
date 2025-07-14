import axios from "axios";


const baseURI = axios.create({
    baseURL : import.meta.env.VITE_EXP_API_URL,
    withCredentials : true
})

const addExpense = async (data) => await baseURI.post('/add', data)

const allExpenses = async () => await baseURI.get('/getAll');

export {
    addExpense,
    allExpenses
}