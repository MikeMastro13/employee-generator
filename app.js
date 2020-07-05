const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let role = '';
let employees = [];
let memberId = 0;

function writeToFile(filename, data) {
    fs.writeFile(filename, data, function(err){
        if (err) {
            console.log(err);
        }
        else {console.log("Success!")};
    })
};

function selectRole() {
    inquirer.prompt([
        {
            type: "list",
            name: "employeeRole",
            message: "Select one of the following...",
            choices: ["Manager", "Engineer", "Intern"]
        }
    ]).then(response => {
        role = response.employeeRole;
        generateTeam();
    });
}

function inputInformation() {
    inquirer.prompt([
        {
            type: "input",
            name: "employeeName",
            message: "Please enter the team members name..."
        },
        {
            type: "input",
            name: "employeeEmail",
            message: "Please enter the employees email"
        }
    ]).then(response => {
        switch(role) {
            case 'Manager':
                inquirer.prompt([
                    {
                        type: "input",
                        name: "officeNumber",
                        message: "Please enter the managers office number..."
                    }
                ]).then(managerResponse => {
                    let manager = new Manager(response.employeeName, memberId, response.employeeEmail, managerResponse.officeNumber);
                    employees.push(manager);
                    memberId++;
                    role = '';
                    checkForTeam();
                })
            break;
            case 'Engineer':
                inquirer.prompt([
                    {
                        type: "input",
                        name: "githubId",
                        message: "Please enter the engineers github id..."
                    }
                ]).then(engineerResponse => {
                    let engineer = new Engineer(response.employeeName, memberId, response.employeeEmail, engineerResponse.githubId);
                    employees.push(engineer);
                    memberId++;
                    role = '';
                    checkForTeam();
                })
            break;
            case 'Intern':
                inquirer.prompt([
                    {
                        type: "input",
                        name: "schoolName",
                        message: "Please enter the interns school name..."
                    }
                ]).then(internResponse => {
                    let intern = new Intern(response.employeeName, memberId, response.employeeEmail, internResponse.schoolName);
                    employees.push(intern);
                    memberId++;
                    role = '';
                    checkForTeam();
                })
            break;
        }
    })
}

function checkForTeam() {
    inquirer.prompt([
        {
            type: "list",
            name: "addMoreEmployees",
            message: "Do you have any more employees to add?",
            choices: ["Yes", "No"]
        }
    ]).then(response => {
        if (response.addMoreEmployees === "Yes") {
            generateTeam();
        } else {
            if (!fs.existsSync(OUTPUT_DIR)) {
                fs.mkdirSync(OUTPUT_DIR)
            }
            fs.writeFileSync(outputPath, render(employees), "utf-8");
        }
    })
}

function generateTeam() {
    if (role != '') {
        inputInformation();
    } else if (role === '') {
        selectRole();
    }
}

generateTeam();