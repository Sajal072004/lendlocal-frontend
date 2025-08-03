import useSWR from 'swr';
import { getUserCommunities, getBorrowRequests, getCommunityDetails, getCommunityItems, getNotifications, getConversations, getMessages, getCommunityInviteCode, searchAll, getAllCommunities, getBorrowRequestDetails, getMyReviews, getAllItems, getAllUsers, getCommunityJoinRequests, getCommunityItemRequests } from './apiService';

export function useUserCommunities() {
  const { data, error, isLoading, mutate } = useSWR('/communities', getUserCommunities);
  return {
    communities: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useBorrowRequests() {
  const { data, error, isLoading, mutate } = useSWR('/borrow/requests', getBorrowRequests);
  return {
    requests: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCommunityDetails(communityId: string) {
  const { data, error, isLoading, mutate } = useSWR(communityId ? `/communities/${communityId}` : null, () => getCommunityDetails(communityId));
  return {
    community: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCommunityItems(communityId: string) {
  const { data, error, isLoading, mutate } = useSWR(communityId ? `/items/community/${communityId}` : null, () => getCommunityItems(communityId));
  return {
    items: data,
    isLoading,
    isError: error,
    mutate,
  };
}

import { getItemDetails } from './apiService';

export function useItemDetails(itemId: string) {
  const { data, error, isLoading, mutate } = useSWR(itemId ? `/items/${itemId}` : null, () => getItemDetails(itemId));
  return {
    item: data,
    isLoading,
    isError: error,
    mutate,
  };
}


// ... existing hooks
import { getUserProfile, getUserLentItems, getUserFollowers } from './apiService';

export function useUserProfile(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/users/${userId}/profile` : null, () => getUserProfile(userId));
  return {
    profile: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useUserLentItems(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/users/${userId}/items` : null, () => getUserLentItems(userId));
  return {
    items: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useUserFollowers(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/users/${userId}/followers` : null, () => getUserFollowers(userId));
  return {
    followers: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// ... existing hooks
import { getMyBorrowingHistory, getMyLendingHistory, getMyFollowers, getMyFollowing } from './apiService';

export function useMyBorrowingHistory() {
  const { data, error, isLoading, mutate } = useSWR('/users/history/borrowed', getMyBorrowingHistory);
  return { history: data, isLoading, isError: error, mutate };
}

export function useMyLendingHistory() {
  const { data, error, isLoading, mutate } = useSWR('/users/history/lent', getMyLendingHistory);
  return { items: data, isLoading, isError: error, mutate };
}

export function useMyFollowers(userId: string | undefined) {
    const { data, error, isLoading, mutate } = useSWR(userId ? `/users/${userId}/followers` : null, () => getMyFollowers(userId!));
    return { followers: data, isLoading, isError: error, mutate };
}

export function useMyFollowing(userId: string | undefined) {
    const { data, error, isLoading, mutate } = useSWR(userId ? `/users/${userId}/following` : null, () => getMyFollowing(userId!));
    return { following: data, isLoading, isError: error, mutate };
}

export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR('/notifications', getNotifications);

  return {
    notifications: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// --- ADD CHAT HOOKS ---
export function useConversations() {
  const { data, error, isLoading, mutate } = useSWR('/chat/conversations', getConversations);
  return {
    conversations: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMessages(conversationId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    conversationId ? `/chat/conversations/${conversationId}/messages` : null,
    () => getMessages(conversationId)
  );
  return {
    messages: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCommunityInviteCode(communityId: string) {
  const { data, error, isLoading } = useSWR(
    communityId ? `/communities/${communityId}/invite-code` : null,
    () => getCommunityInviteCode(communityId)
  );
  return {
    inviteCode: data,
    isLoading,
    isError: error,
  };
}

export function useSearchAll(query: string) {
  const shouldFetch = query && query.trim().length > 1;
  const { data, error, isLoading } = useSWR(
    shouldFetch ? ['/search', query] : null,
    () => searchAll(query)
  );

  return {
    results: data,
    isLoading,
    isError: error,
  };
}

export function useAllCommunities() {
  const { data, error, isLoading, mutate } = useSWR('/communities/all', getAllCommunities);
  return {
    allCommunities: data,
    isLoading,
    isError: error,
    mutate,
  };
}


export function useBorrowRequestDetails(requestId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    requestId ? `/borrow/requests/${requestId}` : null,
    () => getBorrowRequestDetails(requestId)
  );
  return {
    request: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMyReviews() {
  const { data, error, isLoading, mutate } = useSWR('/reviews/my-reviews', getMyReviews);
  return {
    reviews: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAllItems() {
  const { data, error, isLoading, mutate } = useSWR('/items/all', getAllItems);
  return {
    allItems: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAllUsers() {
  const { data, error, isLoading, mutate } = useSWR('/users/all', getAllUsers);
  return {
    allUsers: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCommunityJoinRequests(communityId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    communityId ? `/communities/${communityId}/join-requests` : null,
    () => getCommunityJoinRequests(communityId)
  );
  return {
    joinRequests: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useItemRequests(communityId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    communityId ? `/item-requests/community/${communityId}` : null,
    () => getCommunityItemRequests(communityId)
  );
  return {
    itemRequests: data,
    isLoading,
    isError: error,
    mutate,
  };
}