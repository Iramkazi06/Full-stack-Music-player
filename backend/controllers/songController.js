import axios from "axios";

const getSongs=async(req,res)=>{
try {
    const response = await axios.get(
"https://api.jamendo.com/v3.0/tracks/?client_id=8d455617&format=jsonpretty"

    );
    const data=response.data;
    res.status(200).json(data);
} catch (error) {
    console.error(error.message);
    res.status(500).json({message:error.message});
}
};
const getPlaylistByTag=async(req,res)=>{
    try {
        const tag=(req.params.tag||req.query.tag||"").toString().trim();
        if(!tag)
            return res.status(400).json({message:"Missing tag parameters"});
        const limit=parseInt(req.query.limit ??"10",10)||10;
        const client_Id="8d455617";
        const params={
            client_id:client_Id,
            format:"jsonpretty",
            tags:tag,
            limit,

    };
    const response= await axios.get("https://api.jamendo.com/v3.0/tracks/",{
        params,
    });
    return res.status(200).json(response.data);
    } catch (error) {
        console.error(
            "getPlaylistByTag error",
        error?.response?.data?? error.message??error);
return res.status(500).json({
    message:"Failed to fetch"});
            
  
}

};

const toggleFavourite=async(req,res)=>{
    try{
    const user=req.user;//protected route
    const song=req.body.song;
    const exists = user.favourites.find((fav) => fav.id === song.id);
    if(exists){
        user.favourites=user.favourites.filter((fav)=>fav.id!==song.id);
    }else{
        user.favourites.push(song);
    }
    await user.save();
    return res.status(200).json(user.favourites);
}catch(error){
    console.error(error.message);
    return res.status(400).json({message:"Favourites not added!!"});
}
};
export {getSongs,getPlaylistByTag,toggleFavourite};
