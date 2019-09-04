"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongo_db_1 = __importDefault(require("./mongo_db"));
async function main() {
    try {
        //Creating the app settings
        const app = new app_1.default();
        //Starting the app
        mongo_db_1.default();
        await app.start();
    }
    catch (err) {
        console.log(err);
    }
}
// Starting main function
main();
