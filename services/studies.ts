import { Study } from '@/schemas/studies';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const studiesApi = createApi({
  reducerPath: 'studiesApi',
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
    listStudies: builder.query<Study[], void>({
      query: () => '/studies',
    }),
    getStudy: builder.query<Study, string>({
      query: (code) => `/studies/${code}`,
    }),
  }),
})

export const {
  useListStudiesQuery,
  useGetStudyQuery
} = studiesApi
