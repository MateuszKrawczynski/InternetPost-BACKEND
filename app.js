import { createClient } from '@supabase/supabase-js';
import express, { json } from "express";
import cors from "cors";
import sha1 from "sha1";


const supabaseUrl = process.env.URL;
const supabaseKey = process.env.KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let app = express();

app.use(express.urlencoded());
app.use(cors());
app.use(express.json());

function escapeHTML(s) { 
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

app.listen(80,"0.0.0.0",(req,res) => {
    console.log("API running");
});

app.get("/alive",(req,res) => {
    res.send("true");
});

app.post("/newuser",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let hashed = sha1(password);

    async function getEveryUser(){
        let {data,error} = await supabase.from("users").select("username").eq("username",username);
        if (data.length == 0){
            async function addUser() {
                let {data,error} = await supabase.from("users").insert({"username" : username , "password": hashed}).select();
                res.send("User created");
            }
            addUser();
        }
        else{
            res.send("Something went wrong");
        } 
    }
    getEveryUser();
});

app.post("/login",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let hashed = sha1(password);

    async function action() {
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
        if (data.length == 0){
            res.send("false");
        }
        else{
            if (data[0].password == hashed){
                res.send("true");
            }
            else{
                res.send("false");
            }
        }
    }
    action();
});

app.post("/deluser", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let hashed = sha1(password);
    async function action(){
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
         if (data.length == 0){
            res.send("Something went wrong");
        }
        else{
            if (data[0].password == hashed){
                async function del(){
                    let {data,error} = await supabase.from("users").delete().eq("username",username).select();
                    res.send("User deleted");
                }
                del();
            }
            else{
                res.send("Something went wrong");
            }
        }
    
    }
    action();
});

app.post("/sendmsg",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let hashed = sha1(password);
    let title = req.body.title;

    let reciever = req.body.reciever;
    let content = escapeHTML(req.body.content);

    async function action() {
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
        if (data.length == 0){
            res.send("Something went wrong");
        }
        else{
            if (data[0].password == hashed){
                async function checkuser(){
                    let {data,error} = await supabase.from("users").select("username").eq("username",reciever);
                    if (data.length > 0){
                        async function msg(){
                            let {data,error} = await supabase.from("msg").insert({"from":username,"to":reciever,"content":content,"title":title});
                            res.send("msg sent");
                        }
                        msg();
                    }
                    else{
                        res.send("Something went wrong");
                    }
                }
                checkuser();
            }
            else{
                res.send("Something went wrong");
            }
        }
    }
    action();
});

app.post("/delmsgassender",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let id = req.body.id;
    let hashed = sha1(password);

    async function action() {
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
        if (data.length == 0){
            res.send("Something went wrong");
        }
        else{
            if (data[0].password == hashed){
                async function checkexists(){
                    let {data,error} = await supabase.from("msg").select("*").eq("id",id);
                    if (data.length > 0){
                        if (data[0].from == username){
                            async function del(){
                            let {data,error} = await supabase.from("msg").delete("*").eq("id",id);
                            res.send("msg deleted");
                        }
                        del();
                        }
                        else{
                            res.send("Something went wrong");
                        }
                        
                    }
                    else{
                        res.send("Something went wrong");
                    }
                }
                checkexists();
            }
            else{
                res.send("Something went wrong");
            }
        }
    }
    action();
});

app.post("/delmsgasreciever",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let id = req.body.id;
    let hashed = sha1(password);

    async function action() {
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
        if (data.length == 0){
            res.send("Something went wrong");
        }
        else{
            if (data[0].password == hashed){
                async function checkexists(){
                    let {data,error} = await supabase.from("msg").select("*").eq("id",id);
                    if (data.length > 0){
                        if (data[0].to == username){
                            async function del(){
                            let {data,error} = await supabase.from("msg").delete("*").eq("id",id);
                            res.send("msg deleted");
                        }
                        del();
                        }
                        else{
                            res.send("Something went wrong");
                        }
                        
                    }
                    else{
                        res.send("Something went wrong");
                    }
                }
                checkexists();
            }
            else{
                res.send("Something went wrong");
            }
        }
    }
    action();
});

app.post("/showmsgassender",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let id = req.body.id;
    let hashed = sha1(password);

    async function action() {
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
        if (data.length == 0){
            res.send("Something went wrong");
        }
        else{
            if (data[0].password == hashed){
                async function verify(){
                    let {data,error} = await supabase.from("msg").select("*").eq("id",id);
                    if (data.length > 0){
                        if (data[0].from == username){
                            async function show(){
                                let {data,error} = await supabase.from("msg").select("*").eq("id",id);
                                res.send(JSON.stringify(data[0]));
                            }
                            show();
                        }
                        else{
                            res.send("Something went wrong");
                        }
                    }
                    else{
                        res.send("Something went wrong");
                    }

                }
                verify();
            }
            else{
                res.send("Something went wrong");
            }
        }
    }
    action();
});

app.post("/showmsgasreciever",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let id = req.body.id;
    let hashed = sha1(password);

    async function action() {
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
        if (data.length == 0){
            res.send("Something went wrong");
        }
        else{
            if (data[0].password == hashed){
                async function verify(){
                    let {data,error} = await supabase.from("msg").select("*").eq("id",id);
                    if (data.length > 0){
                        if (data[0].to == username){
                            async function show(){
                                let {data,error} = await supabase.from("msg").select("*").eq("id",id);
                                res.send(JSON.stringify(data[0]));
                            }
                            show();
                        }
                        else{
                            res.send("Something went wrong");
                        }
                    }
                    else{
                        res.send("Something went wrong");
                    }

                }
                verify();
            }
            else{
                res.send("Something went wrong");
            }
        }
    }
    action();
});

app.post("/msglistasreciever",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let hashed = sha1(password);
    async function action() {
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
        if (data.length == 0){
            res.send("false");
        }
        else{
            if (data[0].password == hashed){
                async function getData(){
                    let {data,error} = await supabase.from("msg").select("*").eq("to",username);
                    if(data.length>0){
                        res.send(JSON.stringify(data));
                    }
                    else{
                        res.send("false");
                    }
                }
                getData();
            }
            else{
                res.send("false");
            }
        }
    }
    action();
});


app.post("/msglistassender",(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let hashed = sha1(password);
    async function action() {
        let {data,error} = await supabase.from("users").select("*").eq("username",username);
        if (data.length == 0){
            res.send("false");
        }
        else{
            if (data[0].password == hashed){
                async function getData(){
                    let {data,error} = await supabase.from("msg").select("*").eq("from",username);
                    if(data.length>0){
                        res.send(JSON.stringify(data));
                    }
                    else{
                        res.send("false");
                    }
                }
                getData();
            }
            else{
                res.send("false");
            }
        }
    }
    action();
});




app.use((req,res) => {
    res.send("404");
});
