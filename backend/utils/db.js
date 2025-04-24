import { connect } from 'mongoose';
import User from '../models/userModel.js';

const connectDb = async() => {
  try{
    await connect(`${process.env.MONGO_URI}/realstate`);
    console.log('connected to DB');
    await User.init();
  }catch(err){
    console.log(err); 
  }

}

export default connectDb;