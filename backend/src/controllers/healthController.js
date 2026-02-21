import {healthFunction} from "../services/healthService.js";

export const getHealth = async(req, res) =>{
    const healthData = healthFunction();
    res.json(healthData);
};