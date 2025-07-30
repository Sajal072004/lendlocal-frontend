import api from './api';

// --- Types for our data ---
export interface Community {
  _id: string;
  name: string;
  description: string;
  memberCount: number; // Assuming the backend will provide this
}

export interface BorrowRequest {
  _id: string;
  item: { _id: string; name: string; photos: string[] };
  borrower: { _id: string; name: string; profilePicture: string };
  lender: { _id: string; name: string; profilePicture: string };
  status: 'pending' | 'approved' | 'denied' | 'returned';
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

export interface PublicUserProfile {
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