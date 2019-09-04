import App from './app';

import connectDB from './mongo_db';

async function main(){
  try {
    //Creating the app settings
    const app = new App();
  
    //Starting the app
    connectDB()
    await app.start();
  } catch (err) {
    console.log(err);
  }
}

// Starting main function
main()

