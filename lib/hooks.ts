import useSWR from 'swr';
import { getUserCommunities, getBorrowRequests, getCommunityDetails, getCommunityItems } from './apiService';

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