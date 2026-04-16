import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { getPlaylistByTag,
    getSongs,toggleFavourite,
 } from "../controllers/songController.js";

const songRouter =express.Router();
songRouter.get("/",getSongs);
songRouter.get("/playListByTag/:tag",getPlaylistByTag);
songRouter.post("/favourite",protect,toggleFavourite);//protected route
songRouter.get("/favourites",protect,(req,res)=>{
    res.json(req.user.favourites);
});

export default songRouter;
