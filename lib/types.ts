import mongoose, {Document} from 'mongoose';

interface IPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// An interface for a structured address
interface IAddress {
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

// Update the main User interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; 
  name: string;
  email: string;
  password?: string;
  reputationScore: number;
  location?: IPoint;
  googleId?: string;
  profilePicture?: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  isDisabled: boolean; 
  phoneNumber?: string; 
  address?: IAddress;
}