import { ClientStudies } from '@/schemas/clients';
import { Study } from '@/schemas/studies';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const studiesApi = createApi({
  reducerPath: 'studiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    prepareHeaders(headers) {
      const token = Cookies.get('sessionToken');
      if (token) {
        headers.set('authorization', `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Study'],
  endpoints: (builder) => ({
    listStudies: builder.query<Study[], void>({
      query: () => '/studies',
    }),
    listClientStudies: builder.query<ClientStudies, string>({
      query: (id) => `/client_studies?client_id=${id}`,
      providesTags: ['Study'],
    }),
    getStudy: builder.query<Study, string>({
      query: (code) => `/studies/${code}`,
    }),
    createStudy: builder.mutation<
      Study,
      { storage_ref: string; study_code: string; client_id: string; metadata: object }
    >({
      query: (body) => ({
        url: '/client_studies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Study'],
    }),
  }),
});

export const {
  useListStudiesQuery,
  useGetStudyQuery,
  useCreateStudyMutation,
  useListClientStudiesQuery,
} = studiesApi;
