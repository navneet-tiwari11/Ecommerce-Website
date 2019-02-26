//importing libraries
//var http = require('http');
var express = require('express');
var data = require('./Project_Assignment/Schema/productCollection.json')
var parser = require('body-parser');
var fs = require('fs');
var cors = require('cors');
var exp = express();
exp.use(cors())
//Declaring Vaiables
var appendData = data;
var _url = '/get';
var _url1 = '/add';
var _url2 = '/edit';
var _url3 = '/delete/:id';

exp.use(parser.json());
exp.use(parser.urlencoded({ extended: false }));
exp.post('/add',function(req,res){
    console.log("Add Url invoked")
    var Obj = req.body;
    console.log(Obj);
    appendData.push(Obj);
    console.log(appendData);
    res.send("Product Added");
    fs.writeFileSync('Project_Assignment/Schema/productCollection.json',JSON.stringify(appendData));
    });

exp.route(_url2).post((req,res)=>{
    console.log("Update Url invoked")
    console.log(req.body);
   // res.writeHead(200, {'Content-Type': 'text/json'});
    for(var prod  of data) {
        if(prod.id==req.body.id){
            console.log("inside if");
            prod.id = req.body.id;
            prod.maincategory = req.body.maincategory;
            prod.category = req.body.category;
            prod.company = req.body.company;
            prod.name = req.body.name;
            prod.price = req.body.price;
        }
        fs.writeFileSync('Project_Assignment/Schema/productCollection.json',JSON.stringify(data));
    }
    res.send(data);
});

exp.get('/delete/:id',function(req,res){
    console.log("Delete Url invoked");
    var prodData = data
    for(var e in prodData){
        if(prodData[e].id==req.params.id){
            prodData.splice(e,1);
            console.log("Inside");
        }
           }
    fs.writeFileSync('Project_Assignment/Schema/productCollection.json',JSON.stringify(prodData));

    res.send("Product Deleted");
});

exp.listen(8080,()=>console.log("Server Running on 127.0.0.1:8080/"));
