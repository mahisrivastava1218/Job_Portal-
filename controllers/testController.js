export const testPostcontroller =(req,res) =>{
    const { name } = req.body;
    res.status(200).send(`So client name is ${name}`)
}