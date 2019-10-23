const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
function promptUser() {
 return inquirer.prompt([
   {
     type: "input",
     name: "gituser",
     message: "What is your GitHub username?",
   },
 ])
}
async function gitHubInfo(username) {
 try {
   const queryUrl = `https://api.github.com/users/${username}`;
   const response = await axios.get(queryUrl)
   const user = response.data;
   const gituser = {
     name: user.name,
     company: user.company,
     blog: user.blog,
     bioImg: user.avatar_url,
     location: user.location,
     link: user.html_url,
     numRepos: user.public_repos,
     followers: user.followers,
     email: user.email
   }
   console.log(gituser);
   return gituser;
 } catch (err) {
   console.log(err);
 }
}

function generateHTML(gotGitHub) {
 return `
<!DOCTYPE html>
<html lang=“en”>
<head>
 <meta charset=“UTF-8">
 <meta http-equiv=“X-UA-Compatible” content=“ie=edge”>
 <link rel=“stylesheet” href=“https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css“>
 <title>Document</title>
</head>
<body>
 <div class=“jumbotron jumbotron-fluid”>
 <div class=“container”>
   <h1 class=“display-4”>Hi! My name is ${gotGitHub.name}</h1>
   <p class=“lead”>I am from ${gotGitHub.location}.</p>
   <h3>Example heading <span class=“badge badge-secondary”>Contact Me</span></h3>
   <ul class=“list-group”>
     <li class=“list-group-item”>My GitHub username is ${gotGitHub.link}</li>
   </ul>
 </div>
</div>
</body>
</html>`;
}
promptUser()
 .then(async function (answers) {
   try {
     const gotGitHub = await gitHubInfo(answers.gituser);
     // const color = answers.color
     console.log("test", gotGitHub);
     const html = generateHTML(gotGitHub);
     // console.log(color);
     return writeFileAsync("index.html", html);
   } catch (err) {
     console.log("error here", err);
   }
 })
 .then(function () {
   console.log("wrote to index.html");
 })
 .catch(function (err) {
   console.log(err);
 });