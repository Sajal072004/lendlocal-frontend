import mongoose from 'mongoose';
import api from './api';
import { IUser } from './types';


export interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  type: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  content: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    profilePicture: string;
  }[];
  lastMessage?: Message;
  updatedAt: string;
}


export interface Community {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
  hasPendingRequest?: boolean;
}

export interface BorrowRequest {
  _id: string;
  item: { _id: string; name: string; photos: string[] };
  borrower: { _id: string; name: string; profilePicture: string };
  lender: { _id: string; name: string; profilePicture: string };
  status: 'pending' | 'approved' | 'denied' | 'returned' | 'awaiting_confirmation' | 'return_confirmed';
  createdAt: string;
}


export const getUserCommunities = async (): Promise<Community[]> => {
  const { data } = await api.get('/communities');
  return data;
};

export const getBorrowRequests = async (): Promise<{ incoming: BorrowRequest[], outgoing: BorrowRequest[] }> => {
  const { data } = await api.get('/borrow/requests');
  return data;
};

export const respondToRequest = async (requestId: string, response: 'approved' | 'denied') => {
  const { data } = await api.post(`/borrow/respond/${requestId}`, { response });
  return data;
};

export interface Item {
  _id: string;
  name: string;
  description: string;
  photos: string[];
  availabilityStatus: 'available' | 'borrowed';
  owner: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  community: { 
    _id: string;
    name: string;
  };
  isMemberOfCommunity: boolean; 
}


export interface CommunityDetails extends Community {
    members: {
        _id: string;
        name: string;
        profilePicture: string;
    }[];
    ownerId:string | mongoose.Types.ObjectId;
    pendingJoinRequests:[string | mongoose.Types.ObjectId]
    owner:mongoose.Types.ObjectId;
    isMember:boolean;
}


export const getCommunityDetails = async (communityId: string): Promise<CommunityDetails> => {
  const { data } = await api.get(`/communities/${communityId}`);
  return data;
};

export const getCommunityItems = async (communityId: string): Promise<Item[]> => {
  const { data } = await api.get(`/items/community/${communityId}`);
  return data;
};


export const getItemDetails = async (itemId: string): Promise<Item> => {
  const { data } = await api.get(`/items/${itemId}`);
  console.log("the response from the backend is ", data);
  return data;
};

export const createBorrowRequest = async (itemId: string): Promise<BorrowRequest> => {
  const { data } = await api.post(`/borrow/request/${itemId}`);
  return data;
};


export const createItem = async (formData: FormData): Promise<Item> => {
  const { data } = await api.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', 
    },
  });
  return data;
};



export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  reputationScore: number;
  createdAt: string;
}

export interface PublicUserProfile {
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  _id: string;
  name: string;
  profilePicture: string;
  reputationScore: number;
  createdAt: string;
  followerCount: number;
  transactionCount: number;
}

export interface Follower {
    _id: string;
    follower: {
        _id: string;
        name: string;
        profilePicture: string;
    }
}


export const getUserProfile = async (userId: string): Promise<PublicUserProfile> => {
  const { data } = await api.get(`/users/${userId}/profile`);
  return data;
};

export const getUserLentItems = async (userId: string): Promise<Item[]> => {
    
    const { data } = await api.get(`/users/${userId}/items`);
    return data;
};

export const getUserFollowers = async (userId: string): Promise<Follower[]> => {
    const { data } = await api.get(`/users/${userId}/followers`);
    return data;
}


export const followUser = async (userId: string): Promise<void> => {
  await api.post(`/users/${userId}/follow`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}/unfollow`);
};





export const createCommunity = async (name: string, description: string): Promise<Community> => {
  const { data } = await api.post('/communities', { name, description });
  return data;
};

export const joinCommunity = async (inviteCode: string): Promise<Community> => {
  const { data } = await api.post('/communities/join', { inviteCode });
  return data;
};




export const getMyBorrowingHistory = async (): Promise<BorrowRequest[]> => {
  const { data } = await api.get('/users/history/borrowed');
  return data;
};

export const getMyLendingHistory = async (): Promise<Item[]> => {
  const { data } = await api.get('/users/history/lent');
  return data;
};

export const getMyFollowers = async (userId: string): Promise<Follower[]> => {
    const { data } = await api.get(`/users/${userId}/followers`);
    return data;
}

export const getMyFollowing = async (userId: string): Promise<Follower[]> => {
    const { data } = await api.get(`/users/${userId}/following`);
    return data;
}




export const updateMyProfile = async (formData: FormData): Promise<User> => { 
  const { data } = await api.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};



export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get('/notifications');
  return data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const { data } = await api.post(`/notifications/${notificationId}/read`);
  return data;
};


export const searchItems = async (query: string): Promise<Item[]> => {
  const { data } = await api.get('/items/search', { params: { q: query } });
  return data;
};



export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get('/chat/conversations');
  return data;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const { data } = await api.get(`/chat/conversations/${conversationId}/messages`);
  return data;
};

export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  const { data } = await api.post(`/chat/conversations/${conversationId}/messages`, { content });
  return data;
};

export const startConversation = async (recipientId: string): Promise<Conversation> => {
  const { data } = await api.post('/chat/conversations', {userId2: recipientId });
  return data;
}

export const getCommunityInviteCode = async (communityId: string): Promise<string> => {
  const { data } = await api.get(`/communities/${communityId}/invite-code`);
  return data.inviteCode;
};


export type SearchResult = 
  | { type: 'item'; data: Item } 
  | { type: 'community'; data: Community } 
  | { type: 'user'; data: { _id: string; name: string; profilePicture: string; } };

export const searchAll = async (query: string): Promise<SearchResult[]> => {
  const { data } = await api.get('/search', { params: { q: query } });
  return data;
};

export const getAllCommunities = async (): Promise<Community[]> => {
  const { data } = await api.get('/communities/all');
  return data;
};

export const getBorrowRequestDetails = async (requestId: string): Promise<BorrowRequest> => {
  const { data } = await api.get(`/borrow/requests/${requestId}`);
  return data;
};


export const initiateReturn = async (requestId: string, review?: { rating: number; comment: string }): Promise<void> => {
  await api.post(`/borrow/requests/${requestId}/return`, review);
};

export const confirmReturn = async (requestId: string, review?: { rating: number; comment: string }): Promise<void> => {
  await api.post(`/borrow/requests/${requestId}/confirm-return`, review);
};


export interface Review {
  _id: string;
  rating: number;
  comment: string;
  reviewer: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  item: {
    _id: string;
    name: string;
    photos: string[];
  };
  createdAt: string;
}

export const getMyReviews = async (): Promise<Review[]> => {
  const { data } = await api.get('/reviews/my-reviews');
  return data;
};


export const getAllItems = async (): Promise<Item[]> => {
  const { data } = await api.get('/items/all');
  return data;
};


export const getAllUsers = async (): Promise<IUser[]> => { 
  const { data } = await api.get('/users/all');
  return data;
};


export interface JoinRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  status: 'pending' | 'approved' | 'rejected';
}



export const requestToJoinCommunity = async (communityId: string): Promise<void> => {
  await api.post(`/communities/${communityId}/request-join`);
};

export const getCommunityJoinRequests = async (communityId: string): Promise<JoinRequest[]> => {
  const { data } = await api.get(`/communities/${communityId}/join-requests`);
  return data;
};

export const respondToJoinRequest = async (requestId: string, response: 'approve' | 'reject'): Promise<void> => {
  await api.post(`/communities/join-requests/${requestId}/respond`, { response });
};

export const deleteItem = async (itemId: string): Promise<void> => {
  await api.delete(`/items/${itemId}`);
};


export interface IItemRequest {
  _id: string;
  requestedBy: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  itemName: string;
  description: string;
}

export const createItemRequest = async (communityId: string, itemName: string, description: string): Promise<IItemRequest> => {
  const { data } = await api.post('/item-requests', { community: communityId, itemName, description });
  return data;
};

export const getCommunityItemRequests = async (communityId: string): Promise<IItemRequest[]> => {
  const { data } = await api.get(`/item-requests/community/${communityId}`);
  return data;
};

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (data: { email: string, otp: string, newPassword: string }): Promise<void> => {
  await api.post('/auth/reset-password', data);
};

export const updateCommunity = async (communityId: string, updates: { name: string; description: string }): Promise<CommunityDetails> => {
  const { data } = await api.put(`/communities/${communityId}`, updates);
  return data;
};

export interface NotificationPreferences {
  new_borrow_request?: boolean;
  request_approved?: boolean;
  request_denied?: boolean;
  item_returned?: boolean;
  return_confirmed?: boolean;
  new_join_request?: boolean;
  new_item_request?: boolean;
  new_offer?: boolean;
  offer_accepted?: boolean;
  new_follower?: boolean;
  new_message?: boolean;
}

export interface EmailNotificationPreferences {
  new_borrow_request?: boolean;
  request_approved?: boolean;
  request_denied?: boolean;
  item_returned?: boolean;
  return_confirmed?: boolean;
  new_join_request?: boolean;
  new_item_request?: boolean;
  new_offer?: boolean;
  offer_accepted?: boolean;
  new_follower?: boolean;
  new_message?: boolean;
}

export const updateNotificationPreferences = async (preferences: NotificationPreferences): Promise<void> => {
  await api.put('/users/profile/notification-preferences', preferences);
};


export const updateEmailNotificationPreferences = async (preferences: NotificationPreferences): Promise<void> => {
  await api.put('/users/profile/email-notification-preferences', preferences);
};

export const saveKyc = async (data: { aadhaarNumber: string; panNumber: string }): Promise<void> => {
  await api.post('/auth/kyc', data);
};
