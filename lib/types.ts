import mongoose, {Document} from 'mongoose';
import { NotificationPreferences } from './apiService';

interface IPoint {
  type: 'Point';
  coordinates: [number, number]; 
}


interface IAddress {
  street: string;
  city: string;
  state: string;
  pinCode: string;
}


export interface IUser extends Document {
  _id: mongoose.Types.ObjectId | string; 
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
  kycCompleted: boolean;
  notificationPreferences: NotificationPreferences;
  emailNotificationPreferences: NotificationPreferences;
}