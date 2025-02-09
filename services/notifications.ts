
import { Notification } from '@/schemas/notifications';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    prepareHeaders(headers) {
      const token = Cookies.get('sessionToken')
      if (token) {
        headers.set('authorization', `${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    listNotifications: builder.query<Notification[], void>({
      query: () => 'notifications',
    }),
  }),
})

export const {
  useListNotificationsQuery,
} = notificationsApi
