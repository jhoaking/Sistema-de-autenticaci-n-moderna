import axios, { AxiosRequestConfig } from 'axios';
import { HttpAdapter } from './interface/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpAxiosAdapter implements HttpAdapter {
  async get<T>(url: string, options: AxiosRequestConfig): Promise<{ data: T }> {
    const { data } = await axios.get<T>(url, options);
    return { data };
  }
  async post<T>(
    url: string,
    body: Object,
    options?: AxiosRequestConfig,
  ): Promise<{ data: T }> {
    const { data } = await axios.post<T>(url, body, options);
    return { data };
  }
}
