"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importing app modules
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Importing routes
const index_1 = __importDefault(require("./routes/index"));
class App {
    constructor() {
        this.app = express_1.default();
        this.PORT = parseInt(process.env.PORT || '3000');
        // executing all app functions
        this.settings();
        this.middlewares(),
            this.routes();
    }
    settings() {
        this.app.engine('.hbs', express_handlebars_1.default({
            extname: '.hbs',
            layoutsDir: path_1.default.join(__dirname, 'views/layouts'),
            partialsDir: path_1.default.join(__dirname, 'views/partials')
        }));
        this.app.set('view engine', '.hbs');
        this.app.set('views', path_1.default.join(__dirname, 'views'));
    }
    middlewares() {
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        const storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path_1.default.join(__dirname, 'public/uploads'));
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
            }
        });
        this.app.use(multer_1.default({ storage }).single('image'));
    }
    routes() {
        this.app.use('/', index_1.default);
    }
    start() {
        this.app.listen(this.PORT, () => console.log(`Server on port: ${this.PORT}`));
    }
}
exports.default = App;
