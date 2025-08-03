import api from './api';

// --- ADD NOTIFICATION INTERFACE ---
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

// --- Types for our data ---
export interface Community {
  _id: string;
  name: string;
  description: string;
  memberCount: number; 
}

export interface BorrowRequest {
  _id: string;
  item: { _id: string; name: string; photos: string[] };
  borrower: { _id: string; name: string; profilePicture: string };
  lender: { _id: string; name: string; profilePicture: string };
  status: 'pending' | 'approved' | 'denied' | 'returned';
  createdAt: string;
}

// --- API Functions ---
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
}

export interface CommunityDetails extends Community {
    members: {
        _id: string;
        name: string;
        profilePicture: string;
    }[];
}

// --- New API Functions ---
export const getCommunityDetails = async (communityId: string): Promise<CommunityDetails> => {
  const { data } = await api.get(`/communities/${communityId}`);
  return data;
};

export const getCommunityItems = async (communityId: string): Promise<Item[]> => {
  const { data } = await api.get(`/items/community/${communityId}`);
  return data;
};

// --- New API Functions ---
export const getItemDetails = async (itemId: string): Promise<Item> => {
  const { data } = await api.get(`/items/${itemId}`);
  console.log("the response from the backend is ", data);
  return data;
};

export const createBorrowRequest = async (itemId: string): Promise<BorrowRequest> => {
  const { data } = await api.post(`/borrow/request/${itemId}`);
  return data;
};

// --- New API Function for Creating an Item ---
export const createItem = async (formData: FormData): Promise<Item> => {
  const { data } = await api.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Important for file uploads
    },
  });
  return data;
};

// ... existing types and functions

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
}

export interface Follower {
    _id: string;
    follower: {
        _id: string;
        name: string;
        profilePicture: string;
    }
}

// --- New API Functions ---
export const getUserProfile = async (userId: string): Promise<PublicUserProfile> => {
  const { data } = await api.get(`/users/${userId}/profile`);
  return data;
};

export const getUserLentItems = async (userId: string): Promise<Item[]> => {
    // We need to create this backend endpoint next
    const { data } = await api.get(`/users/${userId}/items`);
    return data;
};

export const getUserFollowers = async (userId: string): Promise<Follower[]> => {
    const { data } = await api.get(`/users/${userId}/followers`);
    return data;
}

// --- ADDED FOLLOW/UNFOLLOW FUNCTIONS ---
export const followUser = async (userId: string): Promise<void> => {
  await api.post(`/users/${userId}/follow`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}/unfollow`);
};
// -----------------------------------------

// ... existing functions

// --- New API Functions for Communities ---
export const createCommunity = async (name: string, description: string): Promise<Community> => {
  const { data } = await api.post('/communities', { name, description });
  return data;
};

export const joinCommunity = async (inviteCode: string): Promise<Community> => {
  const { data } = await api.post('/communities/join', { inviteCode });
  return data;
};

// ... existing functions

// --- New API Functions for "My Profile" ---
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

// ... existing functions

// --- New API Function for Updating "My Profile" ---
export const updateMyProfile = async (formData: FormData): Promise<User> => { // Assuming User type is defined
  const { data } = await api.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};


// --- ADD NOTIFICATION API FUNCTIONS ---
export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get('/notifications');
  return data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const { data } = await api.post(`/notifications/${notificationId}/read`);
  return data;
};

// --- ADD SEARCH FUNCTION (if it's not already there) ---
export const searchItems = async (query: string): Promise<Item[]> => {
  const { data } = await api.get('/items/search', { params: { q: query } });
  return data;
};


// --- ADD CHAT API FUNCTIONS ---
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
  | { type: 'item'; data: Item } // Assuming Item is already defined
  | { type: 'community'; data: Community } // Assuming Community is already defined
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