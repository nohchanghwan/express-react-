import express from 'express';
import path from 'path';

//Development모드
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

//HTTP요청 + JSON파싱
import morgan from 'morgan'; 
import bodyParser from 'body-parser'; 

//MongoDB
import mongoose from 'mongoose';
import session from 'express-session';

//API라우터
import api from './routes';

const app = express();
const port = 3000;
const devPort = 4000;

//MongoDB커넥션
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log('Connected to mongodb server'); });
// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect('mongodb://localhost/codelab');

//API라우터 불러와서사용
app.use('/api', api);

/* support client-side routing */
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

//HTTP + JSON
app.use(morgan('dev'));
app.use(bodyParser.json());
//세션관리 
app.use(session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true
}));

//Express 에러처리
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.use('/', express.static(path.join(__dirname, './../public')));


app.get('/hello', (req, res) => {
    return res.send('Hello CodeLab');
});

app.listen(port, () => {
    console.log('Express is listening on port', port);
});

// Development모드일때 개발서버를 켜는코드
if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}