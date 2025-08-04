export interface HttpAdapter {
  get<T>(url: string, options: any): Promise<{ data: T }>;
  post<T>(url: string, body: Object, options: any): Promise<{ data: T }>;
}
