import { Router } from "express";
import { getProfile } from "../controller/profile.Controllers.js";

export const profile = new Router();

profile.get("/", getProfile);