const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const databaseMiddleware = require('./middlewares/mongodb.js');


//const devRouter = require('./routes/devRouter.js'); // A laisser seulement pour le developpement


const loginRouter = require('./routes/loginRouter.js');
const userRouter = require('./routes/userRouter.js');
const promotionRouter = require('./routes/promotionRouter.js');
const competenceRouter = require('./routes/competencesRouter.js');
const competenceBlockRouter = require('./routes/competenceBlockRouter.js');
const usercompetenceRouter = require('./routes/userCompetence.js');

const documentRouter = require('./routes/documentRouter.js');

const ressourcesRouter = require('./routes/ressourcesRouter.js');


const adminRouter = require('./routes/adminRouter.js');


const app = express();
const port = 16384;



// middlewares
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(databaseMiddleware);

// routes

//app.use(devRouter); // A supprimer après dev

app.use(loginRouter);
app.use(userRouter);
app.use(promotionRouter);
app.use(competenceRouter);
app.use(competenceBlockRouter);
app.use(usercompetenceRouter);
app.use(documentRouter);
app.use(ressourcesRouter);

app.use(adminRouter);


app.listen(port, () => {
    console.log(`server started on localhost:${port}`);
});