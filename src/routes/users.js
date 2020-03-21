const userRoutes = (app, fs) => {
    const uuidv4 = require("uuid/v4");

    const dataPath = './src/data/users.json';


    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };


    //Create Users
    app.post('/users', (req, res) => {

        readFile(data => {
                const newUserId = uuidv4();
                //Add new user
                data[newUserId] = {tasks: []};

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send('{"id":"' + newUserId + '"}');
                });
            },
            true);
    });

    //Create tasks
    app.post('/:id/tasks', (req, res) => {

        readFile(data => {
                const userId = req.params['id'];
                let taskId = uuidv4();
                if (data.hasOwnProperty(userId) === false) {
                    res.status(404).send(`User with ID : ${userId} does not exist`);
                } else {
                    const newTask = {
                        id: taskId,
                        name: req.body.name
                    }
                    // add the new task
                    data[userId].tasks.push(newTask);

                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send(newTask);
                    });
                }
            },
            true);
    });
    //modify tasks
    app.put('/:userId/tasks/:taskId', (req, res) => {
        readFile(data => {
                const userId = req.params["userId"];
                const taskId = req.params["taskId"];
                if (data.hasOwnProperty(userId) === false) {
                    res.status(404).send(`User with ID : ${userId} does not exist`);
                } else {
                    let message = '';
                    let doesTaskExist = false
                    data[userId]['tasks'].forEach(task => {

                        if (task.id == taskId) {
                            doesTaskExist = true;
                            task.name = req.body.name;
                            message = {
                                id: taskId,
                                name: req.body.name
                            }
                        }
                    })
                    if (!doesTaskExist) {
                        res.status(404).send(`Task with ID : ${taskId} does not exist`);
                    } else {
                        writeFile(JSON.stringify(data, null, 2), () => {
                            res.status(200).send(message);
                        });
                    }
                }
            },
            true);
    });

    //delete task
    app.delete('/:userId/tasks/:taskId', (req, res) => {
        readFile(data => {


                const userId = req.params["userId"];
                const taskId = req.params["taskId"];
                let message = '';
                if (data.hasOwnProperty(userId) === false) {
                    res.status(404).send(`User with ID : ${userId} does not exist`);
                } else {
                    let doesTaskExist = false
                    for (i = data[userId]['tasks'].length - 1; i >= 0; --i) {

                        if (data[userId]['tasks'][i].id == taskId) {
                            doesTaskExist = true;
                            message = "users id : " + userId + " The following task has been removed : " + data[userId]['tasks'][i].name;
                            data[userId]['tasks'].splice(i, 1);
                        }
                    }
                    if (!doesTaskExist) {
                        res.status(404).send(`Task with ID : ${taskId} does not exist`);
                    } else {
                        writeFile(JSON.stringify(data, null, 2), () => {
                            res.status(200).send(message);
                        });
                    }
                }
            },
            true);
    });

    // Get task by ID
    app.get('/:id/tasks', (req, res) => {
        const userId = req.params['id'];
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
            }
            if (JSON.parse(data).hasOwnProperty(userId) == false) {
                res.status(404).send(`User with ID : ${userId} does not exist`);
            } else {
                res.status(200).send(JSON.parse(data)[userId]);
            }

        });
    });
};

module.exports = userRoutes;
