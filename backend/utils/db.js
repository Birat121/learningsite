import { connect } from 'mongoose';

const connectDb = async() => {
  try{
    await connect(`${process.env.MONGO_URI}/realstate`);
    console.log('connected to DB');
  }catch(err){
    console.log(err); 
  }

}

export default connectDb;