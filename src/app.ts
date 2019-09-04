//Importing app modules
import express from 'express';
import morgan from 'morgan';
import exphbs from 'express-handlebars';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();


//Importing routes
import IndexRoutes from './routes/index';

class App {
  public app:express.Application;
  private PORT:number;


  constructor(){

    this.app = express();
    this.PORT = parseInt(<string>process.env.PORT || '3000') 

    // executing all app functions
    this.settings();
    this.middlewares(),
    this.routes();
  }

  settings(){
    this.app.engine('.hbs',exphbs({
      extname:'.hbs',
      layoutsDir:path.join(__dirname,'views/layouts'),
      partialsDir:path.join(__dirname,'views/partials')
    }));
    this.app.set('view engine','.hbs');
    this.app.set('views',path.join(__dirname,'views'))
  }

  middlewares(){
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname,'public')));

    const storage = multer.diskStorage({
      destination: (req,file,cb) => {
        cb(null,path.join(__dirname,'public/uploads'));
      },
      filename: (req,file,cb) =>{
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
    });

    this.app.use(multer({storage}).single('image'));
  }

  routes(){
    this.app.use('/',IndexRoutes);
  }

  start(){
    this.app.listen(this.PORT,() => console.log(`Server on port: ${this.PORT}`));
  }

}

export default App;